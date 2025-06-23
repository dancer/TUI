"use client";

import { useTheme } from "@/components/theme-provider";
import { useEffect } from "react";

const themeColors = {
  "geist": "#ffffff",
  "catppuccin-latte": "#eff1f5",
  "catppuccin-mocha": "#1e1e2e", 
  "solarized-light": "#fdf6e3",
  "solarized-dark": "#002b36",
  "nord": "#2e3440",
  "dracula": "#282a36",
  "gruvbox-dark": "#282828",
  "tokyo-night": "#1a1b26",
  "everforest-dark": "#2d353b",
  "papercolor-light": "#eeeeee",
} as const;

export function ThemeMeta() {
  const { theme } = useTheme();

  useEffect(() => {
    const themeColor = themeColors[theme as keyof typeof themeColors] || themeColors["geist"];
    
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.setAttribute('content', themeColor);

    let appleStatusMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatusMeta) {
      appleStatusMeta = document.createElement('meta');
      appleStatusMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(appleStatusMeta);
    }
    
    const lightThemes = ["geist", "catppuccin-latte", "solarized-light", "papercolor-light"];
    const isDarkTheme = !lightThemes.includes(theme);
    appleStatusMeta.setAttribute('content', isDarkTheme ? 'black-translucent' : 'default');
    
  }, [theme]);

  return null;
} 