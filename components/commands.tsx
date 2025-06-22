import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/components/theme-provider";

export interface Command {
  id: string;
  name: string;
  description: string;
  url?: string;
  isInternal?: boolean;
  isThemeCommand?: boolean;
}

export const commands: Command[] = [
  {
    id: ".github",
    name: "GitHub",
    description: "Open tui.cat GitHub repository",
    url: "https://github.com/dancer/tui",
    isInternal: false,
  },
  {
    id: ".vercel",
    name: "Vercel",
    description: "Open Vercel platform",
    url: "https://vercel.com",
    isInternal: false,
  },
  {
    id: ".v0",
    name: "v0",
    description: "Open v0.dev AI interface builder",
    url: "https://v0.dev",
    isInternal: false,
  },
  {
    id: ".aisdk",
    name: "AI SDK",
    description: "Open Vercel AI SDK documentation",
    url: "https://sdk.vercel.ai",
    isInternal: false,
  },
  {
    id: ".help",
    name: "Help",
    description: "View command reference",
    url: "/cmd",
    isInternal: true,
  },
  {
    id: ".ssh",
    name: "SSH",
    description: "Open SSH terminal",
    url: "/ssh",
    isInternal: true,
  },
  {
    id: ".about",
    name: "About",
    description: "Learn about terminal engineering",
    url: "/about",
    isInternal: true,
  },
  {
    id: ".projects",
    name: "Projects",
    description: "View TUI projects",
    url: "/projects",
    isInternal: true,
  },
  {
    id: ".roadmap",
    name: "Roadmap",
    description: "View platform roadmap",
    url: "/roadmap",
    isInternal: true,
  },
  {
    id: ".home",
    name: "Home",
    description: "Return to homepage",
    url: "/",
    isInternal: true,
  },
  {
    id: ".theme",
    name: "Theme",
    description: "Change color theme",
    isThemeCommand: true,
  },
  {
    id: ".a",
    name: "About (shortcut)",
    description: "Quick shortcut to about page",
    url: "/about",
    isInternal: true,
  },
  {
    id: ".p",
    name: "Projects (shortcut)",
    description: "Quick shortcut to projects page",
    url: "/projects",
    isInternal: true,
  },
  {
    id: ".r",
    name: "Roadmap (shortcut)",
    description: "Quick shortcut to roadmap page",
    url: "/roadmap",
    isInternal: true,
  },
  {
    id: ".h",
    name: "Home (shortcut)",
    description: "Quick shortcut to homepage",
    url: "/",
    isInternal: true,
  },
  {
    id: ".c",
    name: "Commands (shortcut)",
    description: "Quick shortcut to command reference",
    url: "/cmd",
    isInternal: true,
  },
];

export interface UseCommandsProps {
  onCommandOutput?: (output: string) => void;
  onCommandInputClose?: () => void;
  onThemeSelectorOpen?: (currentTheme: Theme, availableThemes: Theme[]) => void;
}

export function useCommands({
  onCommandOutput,
  onCommandInputClose,
  onThemeSelectorOpen,
}: UseCommandsProps = {}) {
  const router = useRouter();
  const { theme: currentTheme, setTheme, availableThemes } = useTheme();

  const processCommand = (command: string) => {
    const [cmd, ...args] = command.trim().toLowerCase().split(" ");
    const arg = args.join(" ");

    onCommandOutput?.("");

    const commandDef = commands.find((c) => c.id === cmd);

    if (!commandDef) {
      onCommandOutput?.(`Unknown command: ${cmd}`);
      return;
    }

    if (commandDef.isThemeCommand) {
      if (arg && availableThemes.includes(arg as Theme)) {
        setTheme(arg as Theme);
        onCommandOutput?.(`Theme set to ${arg}.`);
        onCommandInputClose?.();
      } else if (arg) {
        onCommandOutput?.(
          `Invalid theme. Available: ${availableThemes.join(", ")}.`,
        );
      } else {
        onThemeSelectorOpen?.(currentTheme, availableThemes);
        onCommandInputClose?.();
      }
      return;
    }

    if (commandDef.url) {
      if (commandDef.isInternal) {
        router.push(commandDef.url);
      } else {
        window.open(commandDef.url, "_blank", "noopener,noreferrer");
      }
      onCommandInputClose?.();
    }
  };

  return {
    commands,
    processCommand,
    availableThemes,
    currentTheme,
    setTheme,
  };
}
