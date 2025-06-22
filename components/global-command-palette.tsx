"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useCommands } from "@/components/commands";

export function GlobalCommandPalette() {
  const { theme: currentTheme, setTheme, availableThemes } = useTheme();

  const [isCommandInputVisible, setIsCommandInputVisible] = useState(false);
  const [commandInputValue, setCommandInputValue] = useState("");
  const [commandOutput, setCommandOutput] = useState<string | null>(null);

  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [initialThemeBeforeSelector, setInitialThemeBeforeSelector] =
    useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);
  const themeListRef = useRef<HTMLDivElement>(null);
  const commandInputDomRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const forceFocusInput = useCallback(() => {
    const input = commandInputDomRef.current;
    if (!input) return false;

    try {
      input.focus({ preventScroll: true });

      const length = input.value.length;
      input.setSelectionRange(length, length);

      const focused = document.activeElement === input;
      if (!focused) {
        input.focus();
        input.click();
      }

      return document.activeElement === input;
    } catch (error) {
      console.warn("Focus failed:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (isCommandInputVisible) {
      forceFocusInput();

      const rafId = requestAnimationFrame(() => {
        forceFocusInput();
      });

      const timeoutId = setTimeout(() => {
        forceFocusInput();
      }, 50);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timeoutId);
      };
    }
  }, [isCommandInputVisible, forceFocusInput]);

  const { processCommand } = useCommands({
    onCommandOutput: setCommandOutput,
    onCommandInputClose: () => {
      setIsCommandInputVisible(false);
      setCommandInputValue("");
    },
    onThemeSelectorOpen: (currentTheme, availableThemes) => {
      setInitialThemeBeforeSelector(currentTheme);
      const currentIdx = availableThemes.findIndex((t) => t === currentTheme);
      setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0);
      setIsThemeSelectorOpen(true);
    },
  });

  const handleSelectTheme = useCallback(() => {
    const selectedTheme = availableThemes[highlightedIndex];
    setTheme(selectedTheme);
    setIsThemeSelectorOpen(false);
    setInitialThemeBeforeSelector(null);
    setCommandOutput(
      `Theme set to ${selectedTheme.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}.`,
    );
  }, [availableThemes, highlightedIndex, setTheme]);

  const handleCancelThemeSelection = useCallback(() => {
    if (initialThemeBeforeSelector) {
      setTheme(initialThemeBeforeSelector);
    }
    setIsThemeSelectorOpen(false);
    setInitialThemeBeforeSelector(null);
  }, [initialThemeBeforeSelector, setTheme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isThemeSelectorOpen) {
        event.preventDefault();
        switch (event.key) {
          case "ArrowDown":
            setHighlightedIndex((prev) => (prev + 1) % availableThemes.length);
            break;
          case "ArrowUp":
            setHighlightedIndex(
              (prev) =>
                (prev - 1 + availableThemes.length) % availableThemes.length,
            );
            break;
          case "Enter":
            handleSelectTheme();
            break;
          case "Escape":
            handleCancelThemeSelection();
            break;
        }
        return;
      }

      const isInputFocused =
        document.activeElement === commandInputDomRef.current;

      if (isCommandInputVisible && isInputFocused) {
        if (event.key === "Escape") {
          event.preventDefault();
          setIsCommandInputVisible(false);
          setCommandInputValue("");
          setCommandOutput(null);
        } else if (event.key === "Enter") {
          event.preventDefault();
          processCommand(commandInputValue);
        }
        return;
      }

      if (!isCommandInputVisible && !isThemeSelectorOpen) {
        if (event.key === ".") {
          event.preventDefault();
          setIsCommandInputVisible(true);
          setCommandInputValue(".");
          setCommandOutput(null);
        } else if (event.key === "Escape") {
          event.preventDefault();
          processCommand(".home");
        } else if (event.key === "?") {
          event.preventDefault();
          processCommand(".help");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isThemeSelectorOpen,
    isCommandInputVisible,
    commandInputValue,
    highlightedIndex,
    handleSelectTheme,
    handleCancelThemeSelection,
    processCommand,
    availableThemes.length,
  ]);

  useEffect(() => {
    if (isThemeSelectorOpen) {
      const themeToPreview = availableThemes[highlightedIndex];
      if (themeToPreview && themeToPreview !== currentTheme) {
        setTheme(themeToPreview);
      }
    }
  }, [
    isThemeSelectorOpen,
    highlightedIndex,
    availableThemes,
    setTheme,
    currentTheme,
  ]);

  useEffect(() => {
    if (isThemeSelectorOpen && themeListRef.current) {
      const itemElement = themeListRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      itemElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isThemeSelectorOpen, highlightedIndex]);

  const displayedCurrentThemeName = mounted
    ? (isThemeSelectorOpen && initialThemeBeforeSelector
        ? initialThemeBeforeSelector
        : currentTheme
      )
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : "Loading...";

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-auto px-4 transition-all duration-200 ease-in-out",
          (isCommandInputVisible || commandOutput) && !isThemeSelectorOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-2",
        )}
      >
        <div className="flex items-center bg-background border border-border p-3 rounded-lg shadow-lg backdrop-blur-sm">
          <span className="text-muted-foreground mr-2 select-none font-mono text-sm">
            {isCommandInputVisible ? ">" : "#"}
          </span>
          {isCommandInputVisible ? (
            <input
              ref={commandInputDomRef}
              type="text"
              value={commandInputValue}
              onChange={(e) => setCommandInputValue(e.target.value)}
              className={cn(
                "flex-grow bg-transparent focus:outline-none text-sm font-mono",
                "text-foreground placeholder-muted-foreground",
              )}
              placeholder="type command and press Enter..."
              spellCheck="false"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              tabIndex={isCommandInputVisible ? 0 : -1}
            />
          ) : commandOutput ? (
            <span className="text-sm text-muted-foreground font-mono">
              {commandOutput}
            </span>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm mx-auto px-4 transition-all duration-200 ease-in-out",
          isThemeSelectorOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-2",
        )}
      >
        <div className="bg-background border border-border rounded-lg shadow-lg backdrop-blur-sm overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="text-xs text-muted-foreground font-mono">
              Current: {displayedCurrentThemeName}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Use ↑↓ to navigate, Enter to select, Esc to cancel
            </div>
          </div>
          <div ref={themeListRef} className="max-h-48 overflow-y-auto">
            {availableThemes.map((theme, index) => (
              <div
                key={theme}
                className={cn(
                  "px-3 py-2 text-sm font-mono cursor-pointer transition-colors",
                  index === highlightedIndex
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground",
                )}
                onClick={() => {
                  setHighlightedIndex(index);
                  handleSelectTheme();
                }}
              >
                {theme
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
