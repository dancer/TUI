import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Navigation,
  Settings,
  ExternalLink,
  Keyboard,
  Zap,
  Globe,
  Code,
  Palette,
} from "lucide-react";
import { TerminalIcon } from "@/components/terminal-icon";

export const metadata: Metadata = {
  title: "Command Reference - tui.cat",
  description:
    "Complete guide to tui.cat commands, shortcuts, and terminal interactions.",
};

interface CommandItem {
  id: string;
  cmd: string;
  description: React.ReactNode;
  url?: string;
  category: "navigation" | "utility" | "external" | "terminal" | "system";
  icon?: React.ReactNode;
  shortcut?: string;
}

interface CommandCategory {
  name: string;
  description: string;
  icon: React.ReactNode;
  commands: CommandItem[];
}

const commandCategories: CommandCategory[] = [
  {
    name: "Theme & Appearance",
    description: "Customize the visual appearance and theme settings",
    icon: <Palette className="w-3 h-3" />,
    commands: [
      {
        id: "00",
        cmd: ".theme",
        description: (
          <>
            Change the site theme dynamically. Available themes:{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-muted-foreground text-[0.6rem]">
              catppuccin-latte
            </code>
            ,{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-muted-foreground text-[0.6rem]">
              nord
            </code>
            ,{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-muted-foreground text-[0.6rem]">
              tokyo-night
            </code>
            .
          </>
        ),
        category: "utility",
      },
    ],
  },
  {
    name: "Navigation",
    description: "Quick navigation commands for moving around tui.cat",
    icon: <Navigation className="w-3 h-3" />,
    commands: [
      { 
        id: "01", 
        cmd: ".help", 
        description: "Display this command reference and available shortcuts.", 
        url: "/cmd",
        category: "navigation",
        shortcut: "?",
      },
      { 
        id: "02", 
        cmd: ".ssh", 
        description:
          "Access the interactive SSH terminal interface for remote connections.",
        url: "/ssh",
        category: "navigation",
        shortcut: "Ctrl+T",
      },
      { 
        id: "03", 
        cmd: ".about", 
        description:
          "Learn about tui.cat's philosophy and approach to terminal engineering.",
        url: "/about",
        category: "navigation",
      },
      { 
        id: "04", 
        cmd: ".projects", 
        description: "View current TUI projects and development status.", 
        url: "/projects",
        category: "navigation",
      },
      { 
        id: "05", 
        cmd: ".roadmap", 
        description: "View platform roadmap and future development plans.", 
        url: "/roadmap",
        category: "navigation",
      },
      { 
        id: "06", 
        cmd: ".home", 
        description: "Return to the main landing page.", 
        url: "/",
        category: "navigation",
        shortcut: "Esc",
      },
    ],
  },
  {
    name: "Quick Shortcuts",
    description: "Single-letter shortcuts for faster navigation",
    icon: <Zap className="w-3 h-3" />,
    commands: [
      { 
        id: "07", 
        cmd: ".a", 
        description: "Quick shortcut to about page.", 
        url: "/about",
        category: "navigation",
      },
      { 
        id: "08", 
        cmd: ".p", 
        description: "Quick shortcut to projects page.", 
        url: "/projects",
        category: "navigation",
      },
      { 
        id: "09", 
        cmd: ".r", 
        description: "Quick shortcut to roadmap page.", 
        url: "/roadmap",
        category: "navigation",
      },
      { 
        id: "10", 
        cmd: ".h", 
        description: "Quick shortcut to homepage.", 
        url: "/",
        category: "navigation",
      },
      { 
        id: "11", 
        cmd: ".c", 
        description: "Quick shortcut to command reference.", 
        url: "/cmd",
        category: "navigation",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Commands available within the SSH terminal interface",
    icon: <Terminal className="w-3 h-3" />,
    commands: [
      { 
        id: "12", 
        cmd: "ssh", 
        description:
          "Initiate SSH connection to remote server with credential prompt.",
        category: "terminal",
      },
      { 
        id: "13", 
        cmd: "theme", 
        description: "Open interactive theme selector with live preview.", 
        category: "terminal",
      },
      { 
        id: "14", 
        cmd: "neo", 
        description:
          "Display comprehensive system information including OS, browser, and hardware details.",
        category: "terminal",
      },
      { 
        id: "15", 
        cmd: "clear", 
        description: "Clear the terminal screen and reset the session.", 
        category: "terminal",
        shortcut: "Ctrl+L",
      },
      { 
        id: "16", 
        cmd: "ls", 
        description:
          "List files and directories in the current simulated filesystem.",
        category: "terminal",
      },
      { 
        id: "17", 
        cmd: "cd <dir>", 
        description: "Change directory within the simulated filesystem.", 
        category: "terminal",
      },
      { 
        id: "18", 
        cmd: "cat <file>", 
        description: "Display contents of files in the simulated filesystem.", 
        category: "terminal",
      },
      {
        id: "19",
        cmd: "battery",
        description:
          "Display battery status and power information (if supported by browser).",
        category: "terminal",
      },
      {
        id: "20",
        cmd: "exit",
        description: "Close the current session and return to the homepage.",
        category: "terminal",
        shortcut: "Ctrl+D",
      },
    ],
  },
  {
    name: "External Links",
    description: "Quick access to external resources and repositories",
    icon: <ExternalLink className="w-3 h-3" />,
    commands: [
      { 
        id: "21", 
        cmd: ".github", 
        description:
          "Navigate to the tui.cat GitHub repository and view the source code.",
        url: "https://github.com/dancer/tui",
        category: "external",
      },
      {
        id: "22",
        cmd: ".vercel",
        description:
          "Quick link to Vercel platform for deployment and hosting.",
        url: "https://vercel.com",
        category: "external",
      },
      {
        id: "23",
        cmd: ".v0",
        description: "Access v0.dev for AI-powered component generation.",
        url: "https://v0.dev",
        category: "external",
      },
      {
        id: "24",
        cmd: ".aisdk",
        description: "Navigate to Vercel AI SDK documentation and resources.",
        url: "https://sdk.vercel.ai",
        category: "external",
      },
    ],
  },
];

const keyboardShortcuts = [
  { key: ".", description: "Open command palette (from homepage)" },
  { key: "Tab", description: "Autocomplete commands and file paths" },
  { key: "↑/↓", description: "Navigate command history" },
  { key: "Ctrl+C", description: "Cancel current operation" },
  { key: "Ctrl+L", description: "Clear terminal screen" },
  { key: "Esc", description: "Close dialogs or return to homepage" },
];

export default function CommandsPage() {
  return (
    <div className="min-h-screen w-full px-4 font-mono bg-muted/5">
      {/* Simple Terminal Logo Header - Outside the box */}
      <div className="w-full max-w-3xl mx-auto pt-6 pb-6">
        <div className="flex justify-center">
          <Link 
            href="/" 
            className="text-primary hover:text-primary/80 transition-colors"
            aria-label="Return to homepage"
          >
            <TerminalIcon size={20} />
          </Link>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="w-full max-w-3xl mx-auto">
        <div 
          className="bg-background border border-border rounded-lg shadow-sm p-8"
          style={{
            backgroundImage: `radial-gradient(circle, rgb(var(--muted-foreground) / 0.08) 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        >
          {/* Header Section */}
          <div className="border-b border-border pb-6 mb-10">
            <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground mb-6 tracking-wider">
              <span>COMMAND REFERENCE</span>
              <span>COMPLETE GUIDE TO TUI.CAT INTERACTIONS</span>
            </div>
            
            <div className="space-y-4 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                tui.cat provides a comprehensive command interface for efficient
                navigation and interaction. Whether you're using the web
                interface or the SSH terminal, these commands enable rapid
                access to features and external resources through
                keyboard-driven workflows.
              </p>
              
              <div className="py-6">
                <h1 className="text-2xl font-medium text-primary mb-2 tracking-tight">
                  Command Interface
                </h1>
                <p className="text-xs text-muted-foreground italic font-light">
                  Efficient navigation through keyboard-driven commands and
                  shortcuts.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-10">
            {/* Quick Start */}
            <div className="space-y-4">
              <h2 className="text-lg font-light text-primary tracking-tight">
                Quick start
              </h2>
              
              <div className="bg-muted/10 rounded p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Keyboard className="w-4 h-4 text-primary/60" />
                  <span className="text-xs font-medium text-foreground">
                    Getting Started
                  </span>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    Press{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[0.65rem]">
                      .
                    </code>{" "}
                    on the homepage to open the command palette.
                  </p>
                  <p>
                    Navigate to{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[0.65rem]">
                      /ssh
                    </code>{" "}
                    for the full terminal experience with file system simulation
                    and SSH capabilities.
                  </p>
                  <p>
                    All commands are prefixed with{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[0.65rem]">
                      .
                    </code>{" "}
                    for web navigation or used directly in the SSH terminal.
                  </p>
                </div>
              </div>
            </div>

            {/* Command Categories */}
            {commandCategories.map((category, categoryIndex) => {
              const isExternalLinks = category.name === "External Links";

              return (
              <div key={categoryIndex} className="space-y-5">
                  <div className={isExternalLinks ? "space-y-2" : "space-y-5"}>
                <div className="flex items-center space-x-2">
                  <div className="text-primary/60">{category.icon}</div>
                      <h2 className="text-lg font-light text-primary tracking-tight">
                        {category.name}
                      </h2>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                  {category.description}
                </p>
                  </div>
                
                <div className="space-y-4">
                  {category.commands.map((command) => {
                      const content = (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-light text-primary/60 w-6">
                                {command.id}
                              </span>
                              <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono text-foreground">
                                {command.cmd}
                              </code>
                              {command.shortcut && (
                                <span className="text-[0.6rem] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                                  {command.shortcut}
                                </span>
                              )}
                            </div>
                            {command.category === "external" && (
                              <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/50 group-hover/command:text-primary/60 transition-colors" />
                            )}
                          </div>
                          <div className="pl-9">
                            <p className="text-xs text-muted-foreground leading-relaxed group-hover/command:text-muted-foreground/80 transition-colors">
                              {command.description}
                            </p>
                          </div>
                        </div>
                      );

                      return (
                        <div key={command.id} className="group/command">
                          {command.category === "external" && command.url ? (
                            <Link
                              href={command.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:bg-muted/10 rounded-lg p-2 -m-2 transition-colors"
                            >
                              {content}
                            </Link>
                          ) : (
                            content
                          )}
                        </div>
                      );
                  })}
                </div>
              </div>
              );
            })}

            {/* Keyboard Shortcuts */}
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-primary/60" />
                <h2 className="text-lg font-light text-primary tracking-tight">
                  Keyboard shortcuts
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/10 rounded"
                  >
                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground">
                      {shortcut.key}
                    </code>
                    <span className="text-xs text-muted-foreground flex-1 ml-3">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Usage */}
            <div className="space-y-5">
              <h2 className="text-lg font-light text-primary tracking-tight">
                Advanced usage
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <Code className="w-3 h-3 text-primary/60" />
                    <span>SSH Terminal Features</span>
                  </h3>
                  <div className="pl-5">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The SSH terminal provides a full simulated filesystem with
                      tab completion, command history, and real SSH
                      connectivity. Use standard Unix commands like{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-[0.6rem]">
                        ls
                      </code>
                      ,
                      <code className="bg-muted px-1 py-0.5 rounded text-[0.6rem]">
                        cd
                      </code>
                      , and{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-[0.6rem]">
                        cat
                      </code>
                      to explore the environment.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <Globe className="w-3 h-3 text-primary/60" />
                    <span>Global Command Access</span>
                  </h3>
                  <div className="pl-5">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Commands prefixed with{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-[0.6rem]">
                        .
                      </code>{" "}
                      are available globally across the site. Additional
                      shortcuts like{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-[0.6rem]">
                        .vercel
                      </code>
                      ,
                      <code className="bg-muted px-1 py-0.5 rounded text-[0.6rem]">
                        .v0
                      </code>
                      , and{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-[0.6rem]">
                        .aisdk
                      </code>
                      provide quick external navigation.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <Terminal className="w-3 h-3 text-primary/60" />
                    <span>Theme Customization</span>
                  </h3>
                  <div className="pl-5">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Use the{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-[0.6rem]">
                        theme
                      </code>{" "}
                      command in the SSH terminal to access an interactive theme
                      selector with live preview. Themes persist across sessions
                      and include popular options like Catppuccin, Nord, and
                      Tokyo Night.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t border-border">
              <div className="text-center space-y-2">
                <p className="text-[0.6rem] text-muted-foreground tracking-wider">
                  KEYBOARD-DRIVEN • EFFICIENT NAVIGATION • TERMINAL EXCELLENCE
                </p>
                <p className="text-[0.6rem] text-muted-foreground">
                  Master the command interface for maximum productivity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom padding */}
      <div className="pb-12"></div>
    </div>
  );
}
