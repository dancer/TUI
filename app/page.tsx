"use client";

import { useState, useEffect } from "react";
import { Github, Sparkles } from "lucide-react";
import { VercelLogoIcon } from "@/components/icons/vercel-logo";
import { Keyboard } from "@/components/ui/keyboard";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FULL_TEXT = "tui.cat";
const TYPING_SPEED = 250;

const charToKeyCode: { [key: string]: string } = {
  t: "KeyT",
  u: "KeyU",
  i: "KeyI",
  ".": "Period",
  c: "KeyC",
  a: "KeyA",
};

export default function LandingPage() {
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [currentSimulatedKeyCode, setCurrentSimulatedKeyCode] = useState<
    string | undefined
  >(undefined);
  const [hasMounted, setHasMounted] = useState(false);
  const [animationSkippedOnLoad, setAnimationSkippedOnLoad] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasAnimationPlayed = localStorage.getItem(
        "hasLandingAnimationPlayed",
      );
      if (hasAnimationPlayed === "true") {
        setTypedText(FULL_TEXT);
        setIsTypingComplete(true);
        setCurrentSimulatedKeyCode(undefined);
        setAnimationSkippedOnLoad(true);
      }
    }
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || animationSkippedOnLoad) {
      return;
    }

    if (typedText.length < FULL_TEXT.length) {
      setIsTypingComplete(false);
      const charToType = FULL_TEXT[typedText.length];
      setCurrentSimulatedKeyCode(
        charToKeyCode[charToType.toLowerCase()] || undefined,
      );

      const timeoutId = setTimeout(() => {
        setTypedText(FULL_TEXT.slice(0, typedText.length + 1));
      }, TYPING_SPEED);

      return () => {
        clearTimeout(timeoutId);
      };
    } else if (typedText.length === FULL_TEXT.length && !isTypingComplete) {
      setIsTypingComplete(true);
      setCurrentSimulatedKeyCode(undefined);
      if (typeof window !== "undefined") {
        localStorage.setItem("hasLandingAnimationPlayed", "true");
      }
    }
  }, [typedText, hasMounted, isTypingComplete, animationSkippedOnLoad]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)]">
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-16 pb-12 sm:pb-16">
        <div className="relative mb-8 h-20 sm:h-24 md:h-28 flex items-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl tracking-tighter text-foreground">
            {hasMounted ? (
              <>
                {typedText.slice(0, 2)}
                <span className="tracking-[-12px]">{typedText.slice(2, 4)}</span>
                {typedText.slice(4)}
              </>
            ) : ""}
            {hasMounted && (
              <span
                className={cn(
                  "inline-block w-1 h-20 sm:h-28 md:h-28 ml-1 translate-y-6",
                  !isTypingComplete
                    ? "animate-blink bg-foreground"
                    : "bg-foreground",
                )}
              ></span>
            )}
          </h1>
        </div>
        <p className="max-w-md mx-auto text-sm sm:text-base text-muted-foreground text-contrast-enhanced mb-8">
          A curated space for discovering, building, and sharing open-source
          terminal UI applications.
        </p>
        <Link
          href="https://github.com/dancer/tui"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded px-6 py-3 text-sm font-medium transition-colors group"
        >
            Explore on GitHub
            <Github className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        <div className="mt-10 text-xs text-muted-foreground text-contrast-enhanced tracking-wider">
          <span>OPEN SOURCE</span>
          <span className="mx-2">&middot;</span>
          <span>DEVELOPER TOOLS</span>
          <span className="mx-2">&middot;</span>
          <span>COMMAND-LINE</span>
        </div>
        <div className="mt-8 sm:mt-12 md:mt-16 w-full flex justify-center overflow-hidden px-1 sm:px-2">
          {/* isTitleTyping is true if animation is actively playing */}
          <Keyboard
            simulatedKeyCode={currentSimulatedKeyCode}
            isTitleTyping={hasMounted && !isTypingComplete}
          />
        </div>
      </div>
      <footer className="w-full py-4 px-4 sm:px-6 bg-transparent">
        <div className="container mx-auto border-t border-border pt-4 pb-2">
          <div className="flex justify-between items-center">
            <Link
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Vercel"
            >
              <VercelLogoIcon className="h-5 w-5" />
            </Link>
            <Link
              href="https://sdk.vercel.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-0.5 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Vercel AI SDK"
            >
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
