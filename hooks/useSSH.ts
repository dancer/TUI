import { useState, useCallback, useRef, useEffect } from "react";

export interface SSHCredentials {
  host: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
}

export interface SSHMessage {
  type:
    | "connect"
    | "reconnect"
    | "input"
    | "output"
    | "error"
    | "connected"
    | "reconnected"
    | "disconnected"
    | "resize";
  data?: string;
  credentials?: SSHCredentials;
  sessionId?: string;
  cols?: number;
  rows?: number;
}

const SSH_STORAGE_KEY = 'tui-ssh-credentials';
const SSH_TIMESTAMP_KEY = 'tui-ssh-timestamp';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export function useSSH() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const savedCredentials = localStorage.getItem(SSH_STORAGE_KEY);
    const savedTimestamp = localStorage.getItem(SSH_TIMESTAMP_KEY);
    
    if (savedCredentials && savedTimestamp) {
      const timestamp = parseInt(savedTimestamp);
      const now = Date.now();
      
      if (now - timestamp < TWENTY_FOUR_HOURS) {
        try {
          const credentials = JSON.parse(savedCredentials);
          autoReconnect(credentials);
        } catch (err) {
          console.error("Failed to parse saved credentials:", err);
          clearSavedSession();
        }
      } else {
        clearSavedSession();
      }
    }
  }, []);

  const clearSavedSession = useCallback(() => {
    localStorage.removeItem(SSH_STORAGE_KEY);
    localStorage.removeItem(SSH_TIMESTAMP_KEY);
    setSessionId(null);
  }, []);

  const saveCredentials = useCallback((credentials: SSHCredentials) => {
    const credentialsToSave = { ...credentials };
    localStorage.setItem(SSH_STORAGE_KEY, JSON.stringify(credentialsToSave));
    localStorage.setItem(SSH_TIMESTAMP_KEY, Date.now().toString());
  }, []);

  const autoReconnect = useCallback(async (credentials: SSHCredentials) => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setError(null);

    try {
      const response = await fetch('/api/ssh-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_connection_info'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get SSH server connection info: ${response.status}`);
      }

      const { success, websocketUrl, error: apiError } = await response.json();
      
      if (!success) {
        throw new Error(apiError || 'SSH proxy API returned error');
      }

      if (!websocketUrl) {
        throw new Error('No WebSocket URL provided by SSH proxy');
      }

      const ws = new WebSocket(websocketUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: "connect",
          host: credentials.host,
          port: credentials.port || 22,
          username: credentials.username,
          password: credentials.password,
          privateKey: credentials.privateKey,
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case "connected":
              setIsConnected(true);
              setIsConnecting(false);
              if (message.sessionId) {
                setSessionId(message.sessionId);
              }
              break;

            case "output":
              if (
                message.data.includes("\x1b[H\x1b[2J") ||
                message.data.includes("\x1b[2J\x1b[H") ||
                message.data.includes("\x1b[H\x1b[3J")
              ) {
                const promptMatch = message.data.match(
                  /([^@\s]+@[^:\s]+[:$#][^]*?)$/g,
                );
                if (promptMatch) {
                  setOutput(promptMatch[promptMatch.length - 1]);
                } else {
                  setOutput("");
                }
              } else {
                const cleanData = message.data
                  .replace(/\x1b\[[?]?[0-9;]*[hlHJK]/g, "")
                  .replace(/\x1b\]0;[^]*?\x07/g, "");
                setOutput((prev) => prev + cleanData);
              }
              break;

            case "error":
              setError(message.data);
              setIsConnecting(false);
              break;

            case "disconnected":
              setIsConnected(false);
              setIsConnecting(false);
              setOutput((prev) => prev + "\nConnection closed.\n");
              break;
          }
        } catch (err) {
          setError("Failed to parse server message");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error during auto-reconnection:", error);
        setError("Failed to auto-reconnect to SSH session");
        setIsConnecting(false);
      };

      ws.onclose = () => {
        if (!isConnected) {
          setIsConnecting(false);
        }
      };

    } catch (err) {
      console.error("Auto-reconnection error:", err);
      setError("Failed to auto-reconnect to SSH session");
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected]);

  const connect = useCallback(
    async (credentials: SSHCredentials) => {
      if (isConnecting || isConnected) return;

      setIsConnecting(true);
      setError(null);
      setOutput("");

      try {
        const response = await fetch('/api/ssh-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get_connection_info'
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to get SSH server connection info: ${response.status}`);
        }

        const { success, websocketUrl, error: apiError } = await response.json();
        
        if (!success) {
          throw new Error(apiError || 'SSH proxy API returned error');
        }

        if (!websocketUrl) {
          throw new Error('No WebSocket URL provided by SSH proxy');
        }

        if (typeof websocketUrl !== 'string') {
          throw new Error(`Invalid WebSocket URL type: ${typeof websocketUrl}`);
        }

        if (!websocketUrl.startsWith('ws://') && !websocketUrl.startsWith('wss://')) {
          throw new Error(`Invalid WebSocket URL format: ${websocketUrl}`);
        }

        const ws = new WebSocket(websocketUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              type: "connect",
              host: credentials.host,
              port: credentials.port || 22,
              username: credentials.username,
              password: credentials.password,
              privateKey: credentials.privateKey,
            }),
          );
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            switch (message.type) {
              case "connected":
                setIsConnected(true);
                setIsConnecting(false);
                if (message.sessionId) {
                  setSessionId(message.sessionId);
                }
                saveCredentials(credentials);
                break;

              case "output":
                if (
                  message.data.includes("\x1b[H\x1b[2J") ||
                  message.data.includes("\x1b[2J\x1b[H") ||
                  message.data.includes("\x1b[H\x1b[3J")
                ) {
                  const promptMatch = message.data.match(
                    /([^@\s]+@[^:\s]+[:$#][^]*?)$/g,
                  );
                  if (promptMatch) {
                    setOutput(promptMatch[promptMatch.length - 1]);
                  } else {
                    setOutput("");
                  }
                } else {
                  const cleanData = message.data
                    .replace(/\x1b\[[?]?[0-9;]*[hlHJK]/g, "")
                    .replace(/\x1b\]0;[^]*?\x07/g, "");
                  setOutput((prev) => prev + cleanData);
                }
                break;

              case "error":
                setError(message.data);
                setIsConnecting(false);
                break;

              case "disconnected":
                setIsConnected(false);
                setIsConnecting(false);
                setOutput((prev) => prev + "\nConnection closed.\n");
                break;
            }
          } catch (err) {
            setError("Failed to parse server message");
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setError(
            "WebSocket connection failed. Please check your connection and try again.",
          );
          setIsConnecting(false);
        };

        ws.onclose = () => {
          if (!isConnected && !sessionId) {
            setIsConnecting(false);
          }
        };
      } catch (err) {
        console.error("SSH connection error:", err);
        setError(err instanceof Error ? err.message : "Connection failed");
        setIsConnecting(false);
      }
    },
    [isConnecting, isConnected, saveCredentials],
  );

  const sendInput = useCallback(
    (input: string) => {
      if (!isConnected || !wsRef.current) return;

      const trimmedInput = input.trim().toLowerCase();
      if (trimmedInput === 'exit' || trimmedInput === 'logout') {
        clearSavedSession();
      }

      wsRef.current.send(
        JSON.stringify({
          type: "input",
          data: input + "\r",
        }),
      );
    },
    [isConnected, clearSavedSession],
  );

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: "disconnect" }));
      wsRef.current.close();
    }
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
    setOutput("");
    setSessionId(null);
    clearSavedSession();
  }, [clearSavedSession]);

  const clearOutput = useCallback(() => {
    setOutput("");
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    output,
    sessionId,
    connect,
    sendInput,
    disconnect,
    clearOutput,
  };
}
