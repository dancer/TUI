"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, ArrowLeft } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname === "/ssh" || pathname === "/cmd") {
    return null;
  }

  return (
    <header className="w-full py-3 px-4 sm:px-6 fixed top-0 bg-background/80 backdrop-blur-sm z-50 border-b border-border">
      <div className="container mx-auto flex justify-between items-center text-xs text-muted-foreground">
        {pathname === "/" ? (
          <span className="font-medium text-foreground">tui.cat</span>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        )}
        <Link href="/cmd" aria-label="View Commands">
          <Terminal className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
        </Link>
        <span className="text-muted-foreground">{currentYear}</span>
      </div>
    </header>
  );
}
