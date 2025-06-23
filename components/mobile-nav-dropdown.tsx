"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BookOpen, Code, MapPin, Menu, X } from "lucide-react";
import { TerminalIcon } from "@/components/terminal-icon";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface MobileNavDropdownProps {
  currentPage: "about" | "projects" | "roadmap";
}

const navigationItems: NavigationItem[] = [
  {
    id: "about",
    label: "About",
    icon: <BookOpen className="w-4 h-4" />,
    href: "/about",
  },
  {
    id: "projects",
    label: "Projects",
    icon: <Code className="w-4 h-4" />,
    href: "/projects",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: <MapPin className="w-4 h-4" />,
    href: "/roadmap",
  },
  {
    id: "home",
    label: "Home",
    icon: <TerminalIcon size={16} />,
    href: "/",
  },
];

export function MobileNavDropdown({ currentPage }: MobileNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden fixed top-4 right-4 z-40">
      {/* Hamburger Menu Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={cn(
          "group relative flex items-center justify-center w-10 h-10 rounded-md",
          "bg-background/95 border border-border/60",
          "backdrop-blur-sm shadow-sm",
          "before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-br before:from-primary/4 before:via-transparent before:to-primary/6 before:opacity-50",
          "hover:bg-background/98 hover:border-border/80 hover:shadow-md",
          "hover:before:opacity-70",
          "transition-all duration-200 ease-out",
          "hover:scale-[1.02] active:scale-[0.98]",
          "focus:outline-none focus:ring-1 focus:ring-primary/40 focus:ring-offset-1",
          isOpen && "bg-background/98 border-border/80 shadow-md before:opacity-70"
        )}
        aria-label="Navigation menu"
        aria-expanded={isOpen}
      >
        {/* Icon */}
        <div className="relative z-10">
          {isOpen ? (
            <X className="w-4 h-4 text-foreground/80 group-hover:text-foreground transition-colors duration-150" />
          ) : (
            <Menu className="w-4 h-4 text-foreground/80 group-hover:text-foreground transition-colors duration-150" />
          )}
        </div>
        
        {/* Animated border ring */}
        <div className={cn(
          "absolute inset-0 rounded-md border border-primary/30 opacity-0 scale-105",
          "transition-all duration-200 ease-out",
          isOpen && "opacity-100 scale-100"
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute top-12 right-0 w-60 z-50",
            "bg-background border border-border rounded-lg shadow-lg",
            "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-primary/6 before:via-primary/2 before:to-primary/8",
            "after:absolute after:inset-px after:rounded-lg after:bg-gradient-to-b after:from-white/8 after:via-transparent after:to-transparent",
            "animate-in slide-in-from-top-2 duration-200"
          )}
        >
          <div className="relative z-20 p-4">
            {/* Header */}
            <div className="mb-4 pb-3 border-b border-border">
              <div className="text-xs text-muted-foreground tracking-wider font-medium">
                TUI INDUSTRIES
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1">
              {navigationItems.map((item, index) => {
                const isCurrentPage = item.id === currentPage;
                const isHome = item.id === "home";

                if (isHome) {
                  return (
                    <div key={item.id}>
                      <div className="border-t border-border/20 my-3"></div>
                      <Link
                        href={item.href}
                        onClick={closeDropdown}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-md text-sm",
                          "text-primary hover:text-primary/80 hover:bg-muted/50",
                          "border border-transparent hover:border-border/30",
                          "transition-all duration-200 group"
                        )}
                      >
                        <span className="text-primary/70 group-hover:text-primary transition-colors">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </div>
                  );
                }

                if (isCurrentPage) {
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm",
                        "text-foreground bg-primary/10 border border-primary/20"
                      )}
                    >
                      <span className="text-primary/70">{item.icon}</span>
                      <span>{item.label}</span>
                      <span className="ml-auto text-xs text-primary/60 font-mono">
                        current
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={closeDropdown}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm",
                      "text-primary hover:text-primary/80 hover:bg-muted/50",
                      "border border-transparent hover:border-border/30",
                      "transition-all duration-200 group"
                    )}
                  >
                    <span className="text-primary/70 group-hover:text-primary transition-colors">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
} 