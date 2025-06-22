"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type Theme =
  | "geist"
  | "catppuccin-latte"
  | "catppuccin-mocha"
  | "solarized-light"
  | "solarized-dark"
  | "nord"
  | "dracula"
  | "gruvbox-dark"
  | "tokyo-night"
  | "everforest-dark"
  | "papercolor-light";

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

const initialState: ThemeProviderState = {
  theme: "geist",
  setTheme: () => null,
  availableThemes: [
    "geist",
    "catppuccin-latte",
    "catppuccin-mocha",
    "solarized-light",
    "solarized-dark",
    "nord",
    "dracula",
    "gruvbox-dark",
    "tokyo-night",
    "everforest-dark",
    "papercolor-light",
  ],
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "geist",
  storageKey = "tui-cat-theme",
  ...props
}: any) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      return initialState.availableThemes.includes(storedTheme)
        ? storedTheme
        : defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const allPossibleThemeClasses = [
      ...initialState.availableThemes.map((t) =>
        t === "geist" ? "geist-light" : t,
      ),
      "geist-light",
    ];
    root.classList.remove(...allPossibleThemeClasses);

    const newThemeClass = theme === "geist" ? "geist-light" : theme;
    root.classList.add(newThemeClass);
    root.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, newTheme);
      }
      setThemeState(newTheme);
    },
    [storageKey],
  );

  const value = {
    theme,
    setTheme,
    availableThemes: initialState.availableThemes,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
