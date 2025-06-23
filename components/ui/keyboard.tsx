"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { VercelLogoIcon } from "@/components/icons/vercel-logo";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/components/theme-provider";
import { useCommands } from "@/components/commands";

interface KeyboardKeyProps {
  char?: string;
  symbol?: React.ReactNode;
  code: string;
  pressedKeys: Set<string>;
  isSimulatedPress: boolean;
  initialHighlightActive: boolean;
  widthMultiplier?: number;
  isIcon?: boolean;
  variant?: "default" | "modifier";
  onClick?: () => void;
}

const KeyboardKey = ({
  char,
  symbol,
  code,
  pressedKeys,
  isSimulatedPress,
  initialHighlightActive,
  widthMultiplier = 1,
  isIcon = false,
  variant = "default",
  onClick,
}: KeyboardKeyProps) => {
  const isPhysicallyPressed = pressedKeys.has(code);
  const isSpecialTUIMKey = ["KeyT", "KeyU", "KeyI"].includes(code);

  const KEY_UNIT_WIDTH_SM = "1.8rem";
  const KEY_GAP_SM = "0.1rem";
  const widthStyleSm = `calc(${KEY_UNIT_WIDTH_SM} * ${widthMultiplier} + ${KEY_GAP_SM} * ${widthMultiplier - 1})`;

  const baseKeyClasses =
    "h-7 sm:h-9 md:h-10 flex items-center justify-center border rounded font-mono text-[10px] sm:text-sm shadow-sm transition-all duration-75 ease-out transform transition-colors duration-300 ease-in-out";

  let dynamicKeyClasses = "";

  if (isPhysicallyPressed || isSimulatedPress) {
    dynamicKeyClasses =
      "bg-key-pressed-bg text-key-pressed-text border-key-pressed-bg shadow-[0_1px_1px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.1)] translate-y-px";
  } else if (initialHighlightActive && isSpecialTUIMKey) {
    dynamicKeyClasses =
      "bg-key-special-highlight-bg text-key-special-highlight-text border-key-special-highlight-bg";
  } else {
    dynamicKeyClasses =
      variant === "modifier"
        ? "bg-key-modifier-bg text-key-modifier-text border-key-modifier-border hover:brightness-95 shadow-[0_1px_1px_rgba(0,0,0,0.07)]"
        : "bg-key-default-bg text-key-default-text border-key-default-border hover:brightness-95 shadow-[0_1px_1px_rgba(0,0,0,0.07),_inset_0_0.5px_0_rgba(255,255,255,0.3)]";
  }

  let iconColorClass = "";
  if (isIcon) {
    iconColorClass =
      (isPhysicallyPressed || isSimulatedPress) && variant === "modifier"
        ? "text-key-pressed-text"
        : "text-key-default-text opacity-80";
  }

  const keyElement = (
    <div
      className={cn(
        baseKeyClasses,
        dynamicKeyClasses,
        iconColorClass,
        onClick ? "cursor-pointer" : "",
      )}
      style={{ width: widthStyleSm }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {isIcon ? symbol : symbol || char}
    </div>
  );

  return keyElement;
};

const KeyboardRow = ({ children }: { children: React.ReactNode }) => {
  const KEY_GAP_SM = "0.1rem";
  return (
    <div
      className="flex justify-center items-stretch my-0.5 sm:my-1"
      style={{ gap: KEY_GAP_SM }}
    >
      {children}
    </div>
  );
};

interface KeyboardProps {
  simulatedKeyCode?: string;
  isTitleTyping?: boolean;
}

export const Keyboard = ({
  simulatedKeyCode,
  isTitleTyping = false,
}: KeyboardProps) => {
  const { theme: currentTheme, setTheme, availableThemes } = useTheme();

  const [pressedKeys, setPressedKeys] = useState(new Set<string>());
  const [isTuiHighlighted, setIsTuiHighlighted] = useState(false);
  const firstKeyPressDone = useRef(false);

  const [isCommandInputVisible, setIsCommandInputVisible] = useState(false);
  const [commandInputValue, setCommandInputValue] = useState("");
  const [commandOutput, setCommandOutput] = useState<string | null>(null);

  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [initialThemeBeforeSelector, setInitialThemeBeforeSelector] =
    useState<Theme | null>(null);
  const themeListRef = useRef<HTMLDivElement>(null);
  const commandInputDomRef = useRef<HTMLInputElement>(null);

  const [brieflySimulatedKey, setBrieflySimulatedKey] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (simulatedKeyCode) {
      setBrieflySimulatedKey(simulatedKeyCode);
      const timer = setTimeout(() => {
        setBrieflySimulatedKey(undefined);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [simulatedKeyCode]);

  const handleFirstInteraction = useCallback(() => {
    if (!isTitleTyping && !firstKeyPressDone.current) {
      firstKeyPressDone.current = true;
      setIsTuiHighlighted(false);
    }
  }, [isTitleTyping]);

  useEffect(() => {
    let fadeInTimer: NodeJS.Timeout;
    if (isTitleTyping) {
      setIsTuiHighlighted(false);
      firstKeyPressDone.current = false;
    } else {
      if (!firstKeyPressDone.current) {
        fadeInTimer = setTimeout(() => {
          setIsTuiHighlighted(true);
        }, 200);
      } else {
        setIsTuiHighlighted(false);
      }
    }
    return () => clearTimeout(fadeInTimer);
  }, [isTitleTyping]);

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

  const openThemeSelector = useCallback(() => {
    if (isTitleTyping) return;
    handleFirstInteraction();
    setInitialThemeBeforeSelector(currentTheme);
    const currentIdx = availableThemes.findIndex((t) => t === currentTheme);
    setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0);
    setIsThemeSelectorOpen(true);
  }, [currentTheme, availableThemes, isTitleTyping, handleFirstInteraction]);

  const handleSelectTheme = useCallback(
    (themeToSelect?: Theme) => {
      const selectedTheme = themeToSelect || availableThemes[highlightedIndex];
      if (selectedTheme) {
        setTheme(selectedTheme);
        setIsThemeSelectorOpen(false);
        setInitialThemeBeforeSelector(null);
      }
    },
    [highlightedIndex, availableThemes, setTheme],
  );

  const handleCancelThemeSelection = useCallback(() => {
    if (
      initialThemeBeforeSelector &&
      initialThemeBeforeSelector !== currentTheme
    ) {
      setTheme(initialThemeBeforeSelector);
    }
    setIsThemeSelectorOpen(false);
    setInitialThemeBeforeSelector(null);
  }, [initialThemeBeforeSelector, setTheme, currentTheme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTitleTyping) {
        if (isThemeSelectorOpen && event.key === "Escape") {
          handleCancelThemeSelection();
        }
        return;
      }

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

      if (event.key === "." && !isCommandInputVisible && !isThemeSelectorOpen) {
        event.preventDefault();
        handleFirstInteraction();
        setIsCommandInputVisible(true);
        setCommandInputValue(".");
        setCommandOutput(null);
      } else if ((event.key === "?" || (event.shiftKey && event.key === "/")) && !isCommandInputVisible && !isThemeSelectorOpen) {
        event.preventDefault();
        handleFirstInteraction();
        processCommand(".help");
      } else if (!isCommandInputVisible && !isThemeSelectorOpen) {
        handleFirstInteraction();
        setPressedKeys((prev) => new Set(prev).add(event.code));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(event.code);
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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
    isTitleTyping,
    handleFirstInteraction,
    openThemeSelector,
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

  const handleTKeyClick = () => {
    if (isTitleTyping) return;
    handleFirstInteraction();
    openThemeSelector();
  };

  const handleSKeyClick = () => {
    if (isTitleTyping) return;
    handleFirstInteraction();
    processCommand(".ssh");
  };

  const handleHKeyClick = () => {
    if (isTitleTyping) return;
    handleFirstInteraction();
    processCommand(".home");
  };

  const handleAKeyClick = () => {
    if (isTitleTyping) return;
    handleFirstInteraction();
    processCommand(".about");
  };

  const handleRKeyClick = () => {
    if (isTitleTyping) return;
    handleFirstInteraction();
    processCommand(".roadmap");
  };

  const handlePKeyClick = () => {
    if (isTitleTyping) return;
    handleFirstInteraction();
    processCommand(".projects");
  };

  const handleCKeyClick = () => {
    if (isTitleTyping) return;
    handleFirstInteraction();
    processCommand(".help");
  };

  const handleDotKeyClick = () => {
    if (isTitleTyping) return;
    handleFirstInteraction();
    setIsCommandInputVisible(true);
    setCommandInputValue(".");
    setCommandOutput(null);

    setTimeout(() => forceFocusInput(), 0);

    setTimeout(() => {
      if (!forceFocusInput()) {
        setTimeout(() => forceFocusInput(), 100);
      }
    }, 10);
  };

  const keyRowsData = [
    [
      {
        symbol: <VercelLogoIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
        code: "Escape",
        width: 1.25,
        variant: "modifier",
        isIcon: true,
        isLink: true,
        href: "https://v0.dev",
        ariaLabel: "Visit v0.dev",
      },
      { char: "Q", code: "KeyQ" },
      { char: "W", code: "KeyW" },
      { char: "E", code: "KeyE" },
      { char: "R", code: "KeyR", onClick: handleRKeyClick },
      { char: "T", code: "KeyT", onClick: handleTKeyClick },
      { char: "Y", code: "KeyY" },
      { char: "U", code: "KeyU" },
      { char: "I", code: "KeyI" },
      { char: "O", code: "KeyO" },
      { char: "P", code: "KeyP", onClick: handlePKeyClick },
      { symbol: "⌫", code: "Backspace", width: 2.0, variant: "modifier" },
    ],
    [
      { char: "Tab", code: "Tab", width: 1.5, variant: "modifier" },
      { char: "A", code: "KeyA", onClick: handleAKeyClick },
      { char: "S", code: "KeyS", onClick: handleSKeyClick },
      { char: "D", code: "KeyD" },
      { char: "F", code: "KeyF" },
      { char: "G", code: "KeyG" },
      { char: "H", code: "KeyH", onClick: handleHKeyClick },
      { char: "J", code: "KeyJ" },
      { char: "K", code: "KeyK" },
      { char: "L", code: "KeyL" },
      { char: ";", code: "Semicolon" },
      { symbol: "⏎", code: "Enter", width: 1.75, variant: "modifier" },
    ],
    [
      { symbol: "⇧", code: "ShiftLeft", width: 2.0, variant: "modifier" },
      { char: "Z", code: "KeyZ" },
      { char: "X", code: "KeyX" },
      { char: "C", code: "KeyC", onClick: handleCKeyClick },
      { char: "V", code: "KeyV" },
      { char: "B", code: "KeyB" },
      { char: "N", code: "KeyN" },
      { char: "M", code: "KeyM" },
      { char: ",", code: "Comma" },
      { char: ".", code: "Period", onClick: handleDotKeyClick },
      { symbol: "⇧", code: "ShiftRight", width: 2.25, variant: "modifier" },
    ],
    [
      { char: "Ctrl", code: "ControlLeft", width: 1.25, variant: "modifier" },
      { symbol: "⌥", code: "AltLeft", width: 1.25, variant: "modifier" },
      { symbol: "⌘", code: "MetaLeft", width: 1.5, variant: "modifier" },
      { char: "Space", code: "Space", width: 5.0 },
      { symbol: "⌘", code: "MetaRight", width: 1.5, variant: "modifier" },
      { symbol: "⌥", code: "AltRight", width: 1.25, variant: "modifier" },
      { char: "Fn", code: "Fn", width: 1.5, variant: "modifier" },
    ],
  ];

  const displayedCurrentThemeName = (
    isThemeSelectorOpen && initialThemeBeforeSelector
      ? initialThemeBeforeSelector
      : currentTheme
  )
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex justify-center w-full">
        <div
          className={cn(
            "rounded-xl transform transition-all duration-300 ease-out",
            "bg-gradient-to-b from-keyboard-case-from to-keyboard-case-to",
            "border border-key-modifier-border p-0.5 sm:p-1.5",
            "shadow-[0_10px_20px_rgba(0,0,0,0.15),_0_5px_10px_rgba(0,0,0,0.1)]",
            "scale-[0.9] sm:scale-95 md:scale-100 origin-center",
          )}
          style={{
            perspective: "1800px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to right, transparent 2%, black 10%, black 90%, transparent 98%)",
            maskComposite: "intersect",
          }}
        >
          <div
            className="bg-keyboard-plate-bg p-1 sm:p-2 rounded-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]"
            style={{
              transform: "rotateX(10deg) scale(0.96) translateY(-6px)",
              transformOrigin: "center 60%",
            }}
          >
            {keyRowsData.map((row, rowIndex) => (
              <KeyboardRow key={rowIndex}>
                {row.map((keyData: any) => {
                  const keyComponent = (
                    <KeyboardKey
                      key={keyData.code}
                      char={keyData.char}
                      symbol={keyData.symbol}
                      code={keyData.code}
                      pressedKeys={pressedKeys}
                      isSimulatedPress={brieflySimulatedKey === keyData.code}
                      initialHighlightActive={isTuiHighlighted}
                      widthMultiplier={keyData.width}
                      variant={keyData.variant as "modifier" | "default"}
                      isIcon={keyData.isIcon}
                      onClick={keyData.onClick}
                    />
                  );
                  if (keyData.isLink && keyData.href) {
                    return (
                      <a
                        key={`${keyData.code}-link`}
                        href={keyData.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={keyData.ariaLabel}
                        onClick={(e) => {
                          if (isTitleTyping) e.preventDefault();
                          else handleFirstInteraction();
                        }}
                      >
                        {keyComponent}
                      </a>
                    );
                  }
                  return keyComponent;
                })}
              </KeyboardRow>
            ))}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 w-full max-w-[calc(1.8rem*13.25+0.1rem*12.25)] sm:max-w-[calc(2.1rem*13.25+0.15rem*12.25)] mx-auto px-2 sm:px-0 transition-all duration-200 ease-in-out h-10",
          (isCommandInputVisible || commandOutput) && !isThemeSelectorOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-2",
        )}
      >
        <div className="flex items-center bg-muted p-2 rounded-md shadow-md border-border h-full">
          <span className="text-muted-foreground mr-2 select-none">
            {isCommandInputVisible ? ">" : "#"}
          </span>
          {isCommandInputVisible ? (
            <input
              ref={commandInputDomRef}
              type="text"
              value={commandInputValue}
              onChange={(e) => setCommandInputValue(e.target.value)}
              className={cn(
                "flex-grow bg-transparent focus:outline-none text-base",
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
            <span className="text-base text-muted-foreground">
              {commandOutput}
            </span>
          ) : null}
        </div>
      </div>

      {isThemeSelectorOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-mono"
          onClick={handleCancelThemeSelection}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-card text-card-foreground rounded-md shadow-xl w-full max-w-md overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-2 text-base border-b border-border text-muted-foreground">
              Select Theme [current: {displayedCurrentThemeName}]
            </div>
            <div ref={themeListRef} className="max-h-72 overflow-y-auto">
              {availableThemes.map((themeItem, index) => (
                <div
                  key={themeItem}
                  onClick={() => handleSelectTheme(availableThemes[index])}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "px-3 py-1 text-base cursor-default flex items-center",
                    index === highlightedIndex
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted/50 text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mr-2",
                      index === highlightedIndex
                        ? "opacity-100 text-primary-foreground"
                        : "opacity-0 text-foreground",
                    )}
                  >
                    {">"}
                  </span>
                  <span
                    className={cn(
                      index === highlightedIndex
                        ? "text-primary-foreground"
                        : "text-foreground",
                    )}
                  >
                    {themeItem
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    {themeItem === initialThemeBeforeSelector &&
                      !(
                        index === highlightedIndex && themeItem === currentTheme
                      ) && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (original)
                        </span>
                      )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
