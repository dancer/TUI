"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useSSH, SSHCredentials } from "@/hooks/useSSH";
import { SSHLogin } from "@/components/ssh-login";
import { LoadingDots } from "@/components/loading-dots";
import Convert from "ansi-to-html";


interface File {
  type: "file";
  content: string | React.ReactNode;
}

interface Directory {
  type: "directory";
  children: { [key: string]: File | Directory };
}

const fileSystem: Directory = {
  type: "directory",
  children: {
    projects: {
      type: "directory",
      children: {
        "nidalee.rs": {
          type: "file",
          content: (
            <span>
              Project link:{" "}
              <span className="terminal-output-link">
                <a
                  href="https://nidal.ee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://nidal.ee
                </a>
              </span>
            </span>
          ),
        },
        "tui-archive.txt": {
          type: "file",
          content: "A list of notable TUI projects from the past.",
        },
      },
    },
    "readme.md": {
      type: "file",
      content: (
        <div>
          <div>
            <span className="font-semibold">Welcome to the </span>
            <span className="text-primary font-semibold">tui.cat</span>
            <span className="font-semibold"> Interactive Terminal!</span>
          </div>
          <div className="mt-1">
            This is a simulated shell environment. Explore using commands like:
          </div>
          <div className="mt-1 pl-2">
            <div>
              <code className="cat-code-block">ls</code> - list files and
              directories
            </div>
            <div>
              <code className="cat-code-block">cd &lt;directory&gt;</code> -
              change directory
            </div>
            <div>
              <code className="cat-code-block">cat &lt;file&gt;</code> - view
              file contents
            </div>
            <div>
              <code className="cat-code-block">theme</code> - change the
              terminal theme
            </div>
            <div>
              <code className="cat-code-block">neo</code> - display system info
            </div>
            <div>
              <code className="cat-code-block">help</code> - for all commands
            </div>
          </div>
          <div className="mt-1">
            Try: <code className="cat-code-block">cd projects</code> then{" "}
            <code className="cat-code-block">ls</code>
          </div>
          <div className="mt-1 text-muted-foreground">
            (Press Tab for basic autocompletion of filenames/directories)
          </div>
        </div>
      ),
    },
  },
};

const sshHelpInfo = [
  {
    cmd: "theme",
    description: "Open interactive theme selector",
  },
  { cmd: "help", description: "Display this help information." },
  { cmd: "clear", description: "Clear the terminal screen." },
  { cmd: "neo", description: "Display system information." },
  { cmd: "ssh", description: "Connect to remote server via SSH." },
  { cmd: "ls", description: "List files and directories." },
  { cmd: "cd <dir>", description: "Change directory." },
  { cmd: "cat <file>", description: "Display file content." },
  { cmd: "exit", description: "Close the session and return to the homepage." },
];

const getBrowserInfo = (): { name: string; version: string } => {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Firefox/")) {
    const version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || "Unknown";
    return { name: "Firefox", version };
  }

  if (userAgent.includes("Edg/")) {
    const version = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || "Unknown";
    return { name: "Microsoft Edge", version };
  }

  if (userAgent.includes("OPR/") || userAgent.includes("Opera/")) {
    const version =
      userAgent.match(/(?:OPR|Opera)\/(\d+\.\d+)/)?.[1] || "Unknown";
    return { name: "Opera", version };
  }

  if (
    userAgent.includes("Chrome/") &&
    !userAgent.includes("Edg") &&
    !userAgent.includes("OPR")
  ) {
    const version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || "Unknown";
    return { name: "Chrome", version };
  }

  if (
    userAgent.includes("Safari/") &&
    !userAgent.includes("Chrome") &&
    !userAgent.includes("Chromium")
  ) {
    const version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || "Unknown";
    return { name: "Safari", version };
  }

  return { name: "Unknown Browser", version: "Unknown" };
};

const getOSInfo = (): { name: string; version?: string } => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  if (userAgent.includes("Mac OS X")) {
    const version =
      userAgent
        .match(/Mac OS X (\d+[._]\d+[._]?\d*)/)?.[1]
        ?.replace(/_/g, ".") || "Unknown";
    return { name: "macOS", version };
  }

  if (userAgent.includes("Windows NT")) {
    const ntVersion = userAgent.match(/Windows NT (\d+\.\d+)/)?.[1];
    let windowsVersion = "Unknown";

    switch (ntVersion) {
      case "10.0":
        windowsVersion = "10/11";
        break;
      case "6.3":
        windowsVersion = "8.1";
        break;
      case "6.2":
        windowsVersion = "8";
        break;
      case "6.1":
        windowsVersion = "7";
        break;
      default:
        windowsVersion = ntVersion || "Unknown";
    }

    return { name: "Windows", version: windowsVersion };
  }

  if (userAgent.includes("Linux") || platform.includes("Linux")) {
    if (userAgent.includes("Ubuntu")) return { name: "Ubuntu" };
    if (userAgent.includes("Fedora")) return { name: "Fedora" };
    if (userAgent.includes("SUSE")) return { name: "SUSE" };
    return { name: "Linux" };
  }

  if (userAgent.includes("Android")) {
    const version =
      userAgent.match(/Android (\d+(?:\.\d+)?)/)?.[1] || "Unknown";
    return { name: "Android", version };
  }

  if (userAgent.includes("iPhone OS") || userAgent.includes("iOS")) {
    const version =
      userAgent.match(/OS (\d+(?:[._]\d+)*)/)?.[1]?.replace(/_/g, ".") ||
      "Unknown";
    return { name: "iOS", version };
  }

  return { name: "Unknown OS" };
};

const formatUptime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

export default function SSHPage() {
  const { theme: currentTheme, setTheme, availableThemes } = useTheme();
  const [lines, setLines] = useState<React.ReactNode[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/");
  const [possibleCompletions, setPossibleCompletions] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfLinesRef = useRef<HTMLDivElement>(null);

  const ansiConverter = useMemo(
    () =>
      new Convert({
        fg: "#e5e7eb", // Better default foreground color
        bg: "transparent",
        newline: true,
        escapeXML: false,
        stream: false,
        colors: {
          0: "#1f2937", // black - darker for better contrast
          1: "#ef4444", // red - vibrant red
          2: "#22c55e", // green - vibrant green
          3: "#f59e0b", // yellow - amber
          4: "#3b82f6", // blue - vibrant blue
          5: "#a855f7", // magenta - purple
          6: "#06b6d4", // cyan - sky blue
          7: "#f3f4f6", // white - light gray
          8: "#6b7280", // bright black - gray
          9: "#f87171", // bright red - lighter red
          10: "#4ade80", // bright green - lighter green
          11: "#fbbf24", // bright yellow - lighter amber
          12: "#60a5fa", // bright blue - lighter blue
          13: "#c084fc", // bright magenta - lighter purple
          14: "#22d3ee", // bright cyan - lighter sky
          15: "#ffffff", // bright white - pure white
        },
      }),
    [],
  );

  const get256Color = useCallback((code: number): string => {
    if (code < 16) {
      const colors = [
        '#000000', '#800000', '#008000', '#808000', '#000080', '#800080', '#008080', '#c0c0c0',
        '#808080', '#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff', '#ffffff'
      ];
      return colors[code] || '#ffffff';
    } else if (code < 232) {
      const n = code - 16;
      const r = Math.floor(n / 36);
      const g = Math.floor((n % 36) / 6);
      const b = n % 6;
      const toHex = (c: number) => {
        const val = c === 0 ? 0 : 55 + c * 40;
        return val.toString(16).padStart(2, '0');
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } else {
      const gray = 8 + (code - 232) * 10;
      const hex = Math.min(255, gray).toString(16).padStart(2, '0');
      return `#${hex}${hex}${hex}`;
    }
  }, []);
  const processComplexAnsi = useCallback((text: string): string => {
    let processed = text;
    
    processed = processed
      .replace(/\x1b\[38;5;(\d+)m/g, (match, colorCode) => {
        const color = get256Color(parseInt(colorCode));
        return `<span style="color: ${color}">`;
      })
      .replace(/\x1b\[48;5;(\d+)m/g, (match, colorCode) => {
        const color = get256Color(parseInt(colorCode));
        return `<span style="background-color: ${color}">`;
      })
      .replace(/\x1b\[38;2;(\d+);(\d+);(\d+)m/g, (match, r, g, b) => {
        return `<span style="color: rgb(${r}, ${g}, ${b})">`;
      })
      .replace(/\x1b\[48;2;(\d+);(\d+);(\d+)m/g, (match, r, g, b) => {
        return `<span style="background-color: rgb(${r}, ${g}, ${b})">`;
      });
    
    processed = ansiConverter.toHtml(processed);
    
    processed = processed
      .replace(/\x1b\[\d+;\d+H/g, '') // ESC[row;colH - cursor position
      .replace(/\x1b\[\d+H/g, '') // ESC[rowH - cursor to row
      .replace(/\x1b\[\d+A/g, '') // ESC[nA - cursor up
      .replace(/\x1b\[\d+B/g, '') // ESC[nB - cursor down
      .replace(/\x1b\[\d+C/g, '') // ESC[nC - cursor forward
      .replace(/\x1b\[\d+D/g, '') // ESC[nD - cursor back
      
      .replace(/\x1b\[2J/g, '') // ESC[2J - clear screen
      .replace(/\x1b\[H/g, '') // ESC[H - cursor home
      .replace(/\x1b\[K/g, '') // ESC[K - erase to end of line
      .replace(/\x1b\[2K/g, '') // ESC[2K - erase entire line
      .replace(/\x1b\[1K/g, '') // ESC[1K - erase to beginning of line
      
      .replace(/\x1b\[s/g, '') // ESC[s - save cursor
      .replace(/\x1b\[u/g, '') // ESC[u - restore cursor
      .replace(/\x1b7/g, '') // ESC7 - save cursor (alternate)
      .replace(/\x1b8/g, '') // ESC8 - restore cursor (alternate)
      
      .replace(/\x1b\[\d+S/g, '') // ESC[nS - scroll up
      .replace(/\x1b\[\d+T/g, '') // ESC[nT - scroll down
      
      .replace(/\x1b\]0;[^]*?\x07/g, '') // ESC]0;title\BEL
      .replace(/\x1b\]2;[^]*?\x07/g, '') // ESC]2;title\BEL
      
      .replace(/\x1b\[\?\d+[hl]/g, '') // ESC[?nh or ESC[?nl - set/reset mode
      
      .replace(/\x1b\([AB0]/g, '') // ESC(A, ESC(B, ESC(0 - character sets
      
      .replace(/\d+;\d+m/g, '') // Remove orphaned color codes
      .replace(/;\d+m/g, '') // Remove partial sequences
      .replace(/\d+m/g, '') // Remove single numbers followed by m
      
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    return processed;
  }, [ansiConverter, get256Color]);

  const [isSshThemeSelecting, setIsSshThemeSelecting] = useState(false);
  const [sshHighlightedThemeIndex, setSshHighlightedThemeIndex] = useState(0);
  const [sshInitialThemeBeforeSelect, setSshInitialThemeBeforeSelect] =
    useState<Theme | null>(null);
  const themeListContainerRef = useRef<HTMLDivElement>(null);

  const [isSSHLoginMode, setIsSSHLoginMode] = useState(false);
  const [isSSHConnected, setIsSSHConnected] = useState(false);
  const [sshOutput, setSSHOutput] = useState<string>("");
  const [currentSSHHost, setCurrentSSHHost] = useState<string>("");
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectStartTime, setReconnectStartTime] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const ssh = useSSH();

  const handleWelcomeExitClick = useCallback(() => {
    const currentPathForPromptWelcome =
      cwd === "/"
        ? "~"
        : cwd.endsWith("/") && cwd.length > 1
          ? cwd.slice(0, -1)
          : cwd;
    const commandEcho = (
      <div key={`cmd-exit-click-${Date.now()}`} className="flex">
        <span className="text-[hsl(var(--terminal-prompt))] mr-2 select-none">
          guest@tui.cat:
          <span className="text-primary">
            {currentPathForPromptWelcome || "/"}
          </span>
          $
        </span>
        <span>exit</span>
      </div>
    );

    setLines((prevLines) => [
      ...prevLines,
      commandEcho,
      <span key={`disconnect-click-${Date.now()}`}>Disconnecting...</span>,
    ]);

    setTimeout(() => {
      router.push("/");
    }, 500);
  }, [router, setLines, cwd]);

  const welcomeMessagesReactNodes = useMemo(
    () => [
      <span key="welcome-msg-interactive">
        Welcome. Type 'help' for available commands or{" "}
        <button
          onClick={handleWelcomeExitClick}
          className="text-primary hover:underline focus:outline-none appearance-none bg-transparent border-none p-0 m-0 font-inherit cursor-pointer"
          aria-label="Exit to homepage"
        >
          exit
        </button>{" "}
        to close.
      </span>,
    ],
    [handleWelcomeExitClick],
  );

  const initializeTerminal = useCallback(() => {
    setLines([]);
    setCwd("/");
    setPossibleCompletions([]);
    setLines(welcomeMessagesReactNodes);
  }, [welcomeMessagesReactNodes]);

  useEffect(() => {
    const savedCredentials = localStorage.getItem('tui-ssh-credentials');
    const savedTimestamp = localStorage.getItem('tui-ssh-timestamp');
    
    if (savedCredentials && savedTimestamp) {
      const timestamp = parseInt(savedTimestamp);
      const now = Date.now();
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      
      if (now - timestamp < TWENTY_FOUR_HOURS) {
        setIsReconnecting(true);
        setReconnectStartTime(Date.now());
        setIsHydrated(true);
        return;
      } else {
        localStorage.removeItem('tui-ssh-credentials');
        localStorage.removeItem('tui-ssh-timestamp');
      }
    }
    
    initializeTerminal();
    setIsHydrated(true);
  }, [initializeTerminal]);

  const ReconnectingUI = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <LoadingDots size="md" />
      <div className="text-center space-y-2">
        <p className="text-foreground font-medium">Reconnecting to SSH session</p>
        <p className="text-muted-foreground text-sm">Please wait while we restore your connection...</p>
      </div>
    </div>
  );

  useEffect(() => {
    if (!isSshThemeSelecting) {
      inputRef.current?.focus();
    }
    const handlePageClick = (event: MouseEvent) => {
      if (
        !isSshThemeSelecting &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        inputRef.current?.focus();
      }
    };
    window.addEventListener("click", handlePageClick);
    return () => window.removeEventListener("click", handlePageClick);
  }, [isSshThemeSelecting]);

  useEffect(() => {
    if (!isSshThemeSelecting) {
      endOfLinesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, isSshThemeSelecting]);

  useEffect(() => {
    if (isSshThemeSelecting && themeListContainerRef.current) {
      const highlightedItem = themeListContainerRef.current.children[
        sshHighlightedThemeIndex
      ] as HTMLElement;
      highlightedItem?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [sshHighlightedThemeIndex, isSshThemeSelecting]);

  const applySshSelectedTheme = useCallback(
    (selectedThemeName?: Theme) => {
      const themeToApply =
        selectedThemeName || availableThemes[sshHighlightedThemeIndex];
      if (themeToApply) {
        setTheme(themeToApply);
        setLines((prev) => [
          ...prev,
          <span key={`theme-change-${prev.length}-${Date.now()}`}>
            Theme changed to: {themeToApply}
          </span>,
        ]);
      }
      setIsSshThemeSelecting(false);
      setSshInitialThemeBeforeSelect(null);
      setInput("");
      setPossibleCompletions([]);
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [availableThemes, sshHighlightedThemeIndex, setTheme],
  );

  const cancelSshThemeSelection = useCallback(() => {
    if (
      sshInitialThemeBeforeSelect &&
      sshInitialThemeBeforeSelect !== currentTheme
    ) {
      setTheme(sshInitialThemeBeforeSelect);
    }
    setLines((prev) => [
      ...prev,
      <span key={`theme-cancel-${prev.length}-${Date.now()}`}>
        Theme selection cancelled.
      </span>,
    ]);
    setIsSshThemeSelecting(false);
    setSshInitialThemeBeforeSelect(null);
    setInput("");
    setPossibleCompletions([]);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [sshInitialThemeBeforeSelect, currentTheme, setTheme]);

  const handleSSHConnect = useCallback(
    async (credentials: SSHCredentials) => {
      setLines((prev) => [
        ...prev,
        <span key={`ssh-connecting-${Date.now()}`}>
          Connecting to {credentials.username}@{credentials.host}...
        </span>,
      ]);

      try {
        await ssh.connect(credentials);
        setIsSSHConnected(true);
        setIsSSHLoginMode(false);
        setLines([]);
        setCurrentSSHHost(`${credentials.username}@${credentials.host}`);
        setSSHOutput(ssh.output);
      } catch (error) {
        setLines((prev) => [
          ...prev,
          <span key={`ssh-error-${Date.now()}`} className="text-destructive">
            SSH connection failed:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </span>,
        ]);
        setIsSSHLoginMode(false);
      }
    },
    [ssh],
  );

  const handleSSHCancel = useCallback(() => {
    setIsSSHLoginMode(false);
    setLines((prev) => [
      ...prev,
      <span key={`ssh-cancelled-${Date.now()}`}>
        SSH connection cancelled.
      </span>,
    ]);
  }, []);

  const handleSSHDisconnect = useCallback(() => {
    ssh.disconnect();
    setIsSSHConnected(false);
    setCurrentSSHHost("");
    setSSHOutput("");
    setLines([
      ...welcomeMessagesReactNodes,
      <span key={`ssh-disconnected-${Date.now()}`}>
        SSH connection closed.
      </span>,
    ]);
  }, [ssh, welcomeMessagesReactNodes]);

  useEffect(() => {
    if (isSshThemeSelecting && sshInitialThemeBeforeSelect) {
      const themeToPreview = availableThemes[sshHighlightedThemeIndex];
      if (themeToPreview && themeToPreview !== currentTheme) {
        setTheme(themeToPreview);
      }
    }
  }, [
    isSshThemeSelecting,
    sshHighlightedThemeIndex,
    availableThemes,
    setTheme,
    currentTheme,
    sshInitialThemeBeforeSelect,
  ]);

  useEffect(() => {
    if (ssh.isConnected !== isSSHConnected) {
      if (ssh.isConnected && isReconnecting && reconnectStartTime) {
        const elapsed = Date.now() - reconnectStartTime;
        const minDelay = Math.max(0, 1000 - elapsed);
        
        setTimeout(() => {
          setIsSSHConnected(true);
          setIsReconnecting(false);
          setReconnectStartTime(null);
          
          if (!ssh.output || ssh.output.trim() === "") {
            setLines([]);
          }
          setSSHOutput(ssh.output);
          
          if (ssh.output) {
            const promptMatch = ssh.output.match(/([^@\s]+@[^:\s]+)[:$#]/g);
            if (promptMatch && promptMatch.length > 0) {
              const lastPrompt = promptMatch[promptMatch.length - 1];
              const cleanPrompt = lastPrompt.replace(/[:$#]$/, "");
              setCurrentSSHHost(cleanPrompt);
            }
          }
        }, minDelay);
      } else if (ssh.isConnected && !isReconnecting) {
        setIsSSHConnected(true);
        
        if (!ssh.output || ssh.output.trim() === "") {
          setLines([]);
        }
        setSSHOutput(ssh.output);
        
        if (ssh.output) {
          const promptMatch = ssh.output.match(/([^@\s]+@[^:\s]+)[:$#]/g);
          if (promptMatch && promptMatch.length > 0) {
            const lastPrompt = promptMatch[promptMatch.length - 1];
            const cleanPrompt = lastPrompt.replace(/[:$#]$/, "");
            setCurrentSSHHost(cleanPrompt);
          }
        }
      } else if (!ssh.isConnected) {
        setIsSSHConnected(false);
        if (isReconnecting && !ssh.isConnecting) {
          setIsReconnecting(false);
          setReconnectStartTime(null);
        }
      }
    }
  }, [ssh.isConnected, isSSHConnected, ssh.output, isReconnecting, reconnectStartTime]);

  useEffect(() => {
    if (isSSHConnected && ssh.output !== sshOutput) {
      setSSHOutput(ssh.output);

      const promptMatch = ssh.output.match(/([^@\s]+@[^:\s]+)[:$#]/g);
      if (promptMatch && promptMatch.length > 0) {
        const lastPrompt = promptMatch[promptMatch.length - 1];
        const cleanPrompt = lastPrompt.replace(/[:$#]$/, "");
        if (cleanPrompt !== currentSSHHost) {
          setCurrentSSHHost(cleanPrompt);
        }
      }
    }
  }, [ssh.output, isSSHConnected, sshOutput, currentSSHHost]);

  const getDir = (path: string): Directory | null => {
    const parts = path.split("/").filter(Boolean);
    let current: Directory | File = fileSystem;
    for (const part of parts) {
      if (current.type === "directory" && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current.type === "directory" ? current : null;
  };

  const processSshCommand = (fullCommand: string) => {
    const [command, ...args] = fullCommand.trim().split(" ");
    const arg = args.join(" ");
    let response: React.ReactNode | null = null;
    let commandProcessed = true;
    setPossibleCompletions([]);

    switch (command.toLowerCase()) {
      case "ls": {
        const currentDir = getDir(cwd);
        if (currentDir) {
          const items = Object.keys(currentDir.children);
          if (items.length === 0) {
            response = (
              <span className="text-muted-foreground">(empty directory)</span>
            );
          } else {
            response = (
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {items.map((item) => (
                  <span
                    key={item}
                    className={
                      currentDir.children[item].type === "directory"
                        ? "text-primary"
                        : "text-foreground"
                    }
                  >
                    {item}
                    {currentDir.children[item].type === "directory" && "/"}
                  </span>
                ))}
              </div>
            );
          }
        } else {
          response = (
            <span>ls: cannot access '{cwd}': No such file or directory</span>
          );
        }
        break;
      }
      case "cat": {
        if (!arg) {
          response = <span>cat: missing operand</span>;
          break;
        }
        const currentDir = getDir(cwd);
        const file = currentDir?.children[arg];
        if (file && file.type === "file") {
          response = file.content;
        } else if (file && file.type === "directory") {
          response = <span>cat: {arg}: Is a directory</span>;
        } else {
          response = <span>cat: {arg}: No such file or directory</span>;
        }
        break;
      }
      case "cd": {
        const targetPath = arg;
        if (!targetPath) {
          setCwd("/");
          break;
        }
        let resolvedPath = "";
        if (targetPath.startsWith("/")) {
          resolvedPath = targetPath;
        } else {
          const currentParts = cwd.split("/").filter(Boolean);
          const newParts = targetPath.split("/").filter(Boolean);
          for (const part of newParts) {
            if (part === "..") {
              currentParts.pop();
            } else if (part !== ".") {
              currentParts.push(part);
            }
          }
          resolvedPath = "/" + currentParts.join("/");
          if (resolvedPath === "//") resolvedPath = "/";
        }

        if (getDir(resolvedPath)) {
          setCwd(resolvedPath);
        } else {
          response = <span>cd: no such file or directory: {targetPath}</span>;
        }
        break;
      }
      case "exit":
        if (isSSHConnected) {
          handleSSHDisconnect();
          response = null;
        } else {
          response = (
            <span key={`exit-cmd-${lines.length}-${Date.now()}`}>
              Disconnecting...
            </span>
          );
          setTimeout(() => router.push("/"), 500);
        }
        break;
      case "help":
        const helpLines = sshHelpInfo.map((c, idx) => (
          <div key={`help-${idx}`} className="ml-2">
            <span className="text-[hsl(var(--terminal-prompt))] w-32 inline-block select-none">
              {c.cmd}
            </span>
            <span>- {c.description}</span>
          </div>
        ));
        response = (
          <>
            <span key={`help-intro-${lines.length}-${Date.now()}`}>
              Available commands:
            </span>
            {helpLines}
          </>
        );
        break;
      case "theme":
        const themeArg = args[0]?.toLowerCase();
        if (themeArg && availableThemes.includes(themeArg as Theme)) {
          setTheme(themeArg as Theme);
          response = (
            <span key={`theme-direct-${lines.length}-${Date.now()}`}>
              Theme changed to: {themeArg}
            </span>
          );
        } else if (themeArg) {
          response = (
            <>
              <span key={`theme-invalid-${lines.length}-${Date.now()}`}>
                Invalid theme: {themeArg}
              </span>
              <span
                className="block ml-2"
                key={`theme-available-${lines.length}-${Date.now()}`}
              >
                Available themes: {availableThemes.join(", ")}
              </span>
            </>
          );
        } else {
          setSshInitialThemeBeforeSelect(currentTheme);
          const currentIdx = availableThemes.findIndex(
            (t) => t === currentTheme,
          );
          setSshHighlightedThemeIndex(currentIdx >= 0 ? currentIdx : 0);
          setIsSshThemeSelecting(true);
          setLines((prev) => [
            ...prev,
            <span
              className="text-muted-foreground"
              key={`theme-selector-${lines.length}-${Date.now()}`}
            >
              Select theme (Esc to cancel, Enter to select):
            </span>,
          ]);
        }
        break;
      case "clear":
      case "cls":
        setLines([]);
        setSSHOutput("");
        break;
      case "neo":
        const osInfo = getOSInfo();
        const browserInfo = getBrowserInfo();

        const cores = navigator.hardwareConcurrency
          ? `${navigator.hardwareConcurrency} cores`
          : "N/A";
        const screenRes = `${window.screen.width}×${window.screen.height}`;
        const lang = navigator.language || "N/A";
        const timezone =
          Intl.DateTimeFormat().resolvedOptions().timeZone || "N/A";

        const osDisplay = osInfo.version
          ? `${osInfo.name} ${osInfo.version}`
          : osInfo.name;
        const browserDisplay = `${browserInfo.name} ${browserInfo.version}`;

        const uptime = formatUptime(performance.now());

        const neoOutput = [
          `OS: ${osDisplay}`,
          `Host: ${navigator.platform}`,
          `Browser: ${browserDisplay}`,
          `Resolution: ${screenRes}`,
          `CPU: ${cores}`,
          `Locale: ${lang}`,
          `Timezone: ${timezone}`,
          `Uptime: ${uptime}`,
        ];

        response = (
          <div>
            {neoOutput.map((line, idx) => (
              <div key={`neo-${idx}`}>{line}</div>
            ))}
          </div>
        );
        break;

      case "ssh":
        if (isSSHConnected) {
          response = (
            <span>
              Already connected to SSH session. Type 'exit' to disconnect.
            </span>
          );
        } else {
          setLines([]);
          setIsSSHLoginMode(true);
          response = null;
        }
        break;
      default:
        if (fullCommand.trim()) {
          response = (
            <span key={`command-not-found-${lines.length}-${Date.now()}`}>
              command not found: {fullCommand.split(" ")[0]}
            </span>
          );
        } else {
          commandProcessed = false;
        }
        break;
    }

    if (
      response &&
      !(command.toLowerCase() === "theme" && !args[0] && !isSshThemeSelecting)
    ) {
      setLines((prev) => [...prev, response]);
    }
    return commandProcessed;
  };

  const handleTabCompletion = () => {
    const parts = input.split(" ");
    const currentCmd = parts[0].toLowerCase();
    const currentArgFragment = parts.length > 1 ? parts[parts.length - 1] : "";

    const commandsToCompleteFor = ["cat", "ls", "cd"];
    if (commandsToCompleteFor.includes(currentCmd) && parts.length > 1) {
      const currentDir = getDir(cwd);
      if (currentDir) {
        const itemsInDir = Object.keys(currentDir.children);
        const matches = itemsInDir.filter((item) =>
          item.toLowerCase().startsWith(currentArgFragment.toLowerCase()),
        );

        if (matches.length === 1) {
          const completedArg =
            matches[0] +
            (currentDir.children[matches[0]].type === "directory" ? "/" : " ");
          const newInput = [...parts.slice(0, -1), completedArg].join(" ");
          setInput(newInput);
          setPossibleCompletions([]);
        } else if (matches.length > 1) {
          setPossibleCompletions(matches);
        } else {
          setPossibleCompletions([]);
        }
      }
    } else {
      setPossibleCompletions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isSshThemeSelecting) {
      e.preventDefault();
      switch (e.key) {
        case "ArrowDown":
          setSshHighlightedThemeIndex(
            (prev) => (prev + 1) % availableThemes.length,
          );
          break;
        case "ArrowUp":
          setSshHighlightedThemeIndex(
            (prev) =>
              (prev - 1 + availableThemes.length) % availableThemes.length,
          );
          break;
        case "Enter":
          applySshSelectedTheme();
          break;
        case "Escape":
          cancelSshThemeSelection();
          break;
      }
      return;
    }

    if (isSSHConnected) {
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        ssh.sendInput("\x03");
        return;
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        ssh.sendInput("\x04");
        return;
      }
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        ssh.sendInput("\x1a");
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        ssh.sendInput(input);
        setInput("");
        return;
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      handleTabCompletion();
      return;
    }
    if (possibleCompletions.length > 0 && e.key !== "Shift") {
      setPossibleCompletions([]);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const commandToProcess = input.trim();

      if (!isSSHConnected) {
        const currentPathForPrompt =
          cwd === "/"
            ? "~"
            : cwd.endsWith("/") && cwd.length > 1
              ? cwd.slice(0, -1)
              : cwd;
        const commandLine = (
          <div key={`cmd-${lines.length}-${Date.now()}`} className="flex">
            <span className="text-[hsl(var(--terminal-prompt))] mr-2 select-none">
              guest@tui.cat:
              <span className="text-primary">
                {currentPathForPrompt || "/"}
              </span>
              $
            </span>
            <span>{commandToProcess}</span>
          </div>
        );
        if (
          commandToProcess ||
          (welcomeMessagesReactNodes &&
            lines.length > welcomeMessagesReactNodes.length)
        ) {
          setLines((prev) => [...prev, commandLine]);
        } else if (commandToProcess) {
          setLines((prev) => [...prev, commandLine]);
        }

        processSshCommand(commandToProcess);
      }

      setInput("");
    }
  };

  const renderThemeSelector = () => {
    if (!isSshThemeSelecting) return null;
    return (
      <div
        ref={themeListContainerRef}
        className="flex flex-col py-1 max-h-48 overflow-y-auto"
      >
        {availableThemes.map((themeItem, index) => (
          <div
            key={themeItem}
            onClick={() => applySshSelectedTheme(themeItem)}
            className={cn(
              "pl-2 pr-1 py-0.5 text-sm cursor-pointer flex items-center whitespace-nowrap",
              index === sshHighlightedThemeIndex
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted/30",
            )}
          >
            <span
              className={cn(
                "mr-2",
                index === sshHighlightedThemeIndex
                  ? "opacity-100"
                  : "opacity-0",
              )}
            >
              {">"}
            </span>
            <span>
              {themeItem
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
            {themeItem === sshInitialThemeBeforeSelect &&
              !(
                index === sshHighlightedThemeIndex && themeItem === currentTheme
              ) && (
                <span className="text-xs text-muted-foreground ml-2 opacity-70">
                  (original)
                </span>
              )}
          </div>
        ))}
      </div>
    );
  };

  const currentPathForPrompt =
    cwd === "/"
      ? "~"
      : cwd.endsWith("/") && cwd.length > 1
        ? cwd.slice(0, -1)
        : cwd;

  if (isReconnecting && isHydrated) {
    return (
      <div
        className="h-screen w-screen p-2 sm:p-3 md:p-4 overflow-y-auto bg-background text-foreground font-mono text-sm sm:text-base"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        <ReconnectingUI />
      </div>
    );
  }

  if (!isHydrated) {
    return null;
  }

  return (
    <div
      className="h-screen w-screen p-2 sm:p-3 md:p-4 overflow-y-auto cursor-text bg-background text-foreground font-mono text-sm sm:text-base"
      style={{ fontFamily: "var(--font-geist-mono)" }}
      onClick={() => {
        if (!isSshThemeSelecting) inputRef.current?.focus();
      }}
    >
      <div className="flex flex-col">
        {lines.map((line, index) => (
          <div
            key={index}
            className="leading-tight text-[hsl(var(--terminal-text))]"
          >
            {line}
          </div>
        ))}
        {renderThemeSelector()}
        {isSSHLoginMode && (
          <SSHLogin
            onConnect={handleSSHConnect}
            onCancel={handleSSHCancel}
            isConnecting={ssh.isConnecting}
            error={ssh.error}
          />
        )}
        {isSSHConnected && (
          <div className="leading-tight text-[hsl(var(--terminal-text))]">
            <div
              className="ssh-output whitespace-pre-wrap inline"
              dangerouslySetInnerHTML={{
                __html: sshOutput ? processComplexAnsi(sshOutput) : "",
              }}
            />
            <span className="text-[hsl(var(--terminal-text))]">{input}</span>
            <span className="ssh-blinking-cursor inline-block w-2 h-4 sm:h-5 -mb-0.5 ml-0.5"></span>
          </div>
        )}
        {possibleCompletions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[hsl(var(--terminal-text))] opacity-75">
            {possibleCompletions.map((comp) => (
              <span key={comp}>{comp}</span>
            ))}
          </div>
        )}
      </div>

      {!isSshThemeSelecting && !isSSHLoginMode && !isSSHConnected && !ssh.isConnecting && !isReconnecting && (
        <div className="flex leading-tight mt-1">
          <span className="text-[hsl(var(--terminal-prompt))] mr-2 select-none">
            guest@tui.cat:
            <span className="text-primary">{currentPathForPrompt || "/"}</span>$
          </span>
          <span className="text-[hsl(var(--terminal-text))]">{input}</span>
          <span className="ssh-blinking-cursor inline-block w-2 h-4 sm:h-5 -mb-0.5 ml-0.5"></span>
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => {
          if (!isSshThemeSelecting) setInput(e.target.value);
          if (possibleCompletions.length > 0) setPossibleCompletions([]);
        }}
        onKeyDown={handleKeyDown}
        className="absolute top-0 left-0 w-0 h-0 opacity-0"
        spellCheck="false"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
      />
      <div ref={endOfLinesRef} />
    </div>
  );
}
