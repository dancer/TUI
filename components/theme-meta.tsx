"use client";

import { useEffect } from "react";
import { useTheme } from "./theme-provider";

export function ThemeMeta() {
  const themeColors = {
    "geist": "#f5f5f5", // 0 0% 96.1%
    "catppuccin-latte": "#eff1f5", // 220 23% 95%
    "catppuccin-mocha": "#1e1e2e", // 240 21% 15%
    "solarized-light": "#fffcf0", // 47 100% 97% 
    "solarized-dark": "#2a2518", // 44 27% 13% 
    "nord": "#303745", // 220 18% 23% 
    "dracula": "#282a36", // 231 15% 18%
    "gruvbox-dark": "#2d2925", // 30 10% 16%
    "tokyo-night": "#1e2034", // 233 27% 16%
    "everforest-dark": "#293229", // 120 10% 18%
    "papercolor-light": "#eeeeee", // 60 100% 94%
  };

  const lightThemes = ["geist", "catppuccin-latte", "solarized-light", "papercolor-light"];

  const { theme } = useTheme();

  useEffect(() => {
    const themeColor = themeColors[theme as keyof typeof themeColors] || themeColors["geist"];
    const isLightTheme = lightThemes.includes(theme);
    
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement("meta");
      themeColorMeta.setAttribute("name", "theme-color");
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.setAttribute("content", themeColor);

    let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!statusBarMeta) {
      statusBarMeta = document.createElement("meta");
      statusBarMeta.setAttribute("name", "apple-mobile-web-app-status-bar-style");
      document.head.appendChild(statusBarMeta);
    }
    statusBarMeta.setAttribute("content", isLightTheme ? "default" : "black-translucent");
  }, [theme, lightThemes]);

  return null;
} 