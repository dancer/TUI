import { NextRequest } from "next/server";
import { WebSocketServer, WebSocket } from "ws";
import { Client, ConnectConfig } from "ssh2";
import { IncomingMessage } from "http";
import { Duplex } from "stream";

const connections = new Map<string, { ssh: Client; stream: any }>();

let wss: WebSocketServer | null = null;

export async function GET(request: NextRequest) {
  const upgrade = request.headers.get("upgrade");

  if (upgrade?.toLowerCase() !== "websocket") {
    return new Response("This endpoint requires WebSocket upgrade", {
      status: 426,
      headers: {
        Upgrade: "websocket",
        Connection: "Upgrade",
      },
    });
  }

  return new Response(
    "WebSocket upgrade not supported in Next.js API routes. Use custom server.",
    {
      status: 501,
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
}

export function createSSHWebSocketServer(port: number = 3001) {
  if (wss) return wss;

  wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket, request: IncomingMessage) => {
    const connectionId = Math.random().toString(36).substring(7);

    handleSSHConnection(ws, connectionId);
  });

  return wss;
}

function handleSSHConnection(ws: WebSocket, connectionId: string) {
  const ssh = new Client();
  let currentStream: any = null;

  ws.on("message", (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case "connect":
          const config: ConnectConfig = {
            host: message.host,
            port: message.port || 22,
            username: message.username,
            timeout: 10000,
          };

          if (message.password) {
            config.password = message.password;
          } else if (message.privateKey) {
            config.privateKey = message.privateKey;
          }

          ssh.connect(config);
          break;

        case "input":
          if (currentStream) {
            currentStream.write(message.data);
          }
          break;

        case "resize":
          if (currentStream && message.cols && message.rows) {
            currentStream.setWindow(message.rows, message.cols);
          }
          break;

        case "disconnect":
          ssh.end();
          break;
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: "error",
          data: `Invalid message format: ${error instanceof Error ? error.message : "Unknown error"}`,
        }),
      );
    }
  });

  ssh.on("ready", () => {
    ws.send(JSON.stringify({ type: "connected" }));

    ssh.shell({ term: "xterm-256color" }, (err, stream) => {
      if (err) {
        ws.send(JSON.stringify({ type: "error", data: err.message }));
        return;
      }

      currentStream = stream;
      connections.set(connectionId, { ssh, stream });

      stream.on("data", (data: Buffer) => {
        ws.send(JSON.stringify({ type: "output", data: data.toString() }));
      });

      stream.on("close", () => {
        ws.send(JSON.stringify({ type: "disconnected" }));
        connections.delete(connectionId);
        ssh.end();
      });

      stream.stderr.on("data", (data: Buffer) => {
        ws.send(JSON.stringify({ type: "error", data: data.toString() }));
      });
    });
  });

  ssh.on("error", (err) => {
    ws.send(JSON.stringify({ type: "error", data: err.message }));
    connections.delete(connectionId);
  });

  ssh.on("end", () => {
    ws.send(JSON.stringify({ type: "disconnected" }));
    connections.delete(connectionId);
  });

  ws.on("close", () => {
    const connection = connections.get(connectionId);
    if (connection) {
      connection.ssh.end();
      connections.delete(connectionId);
    }
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error for ${connectionId}:`, error);
    const connection = connections.get(connectionId);
    if (connection) {
      connection.ssh.end();
      connections.delete(connectionId);
    }
  });
}
