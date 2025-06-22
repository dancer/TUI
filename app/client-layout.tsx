"use client";

import type React from "react";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import { GlobalCommandPalette } from "@/components/global-command-palette";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ThemeProvider defaultTheme="geist-light" storageKey="tui-cat-theme">
      {/* Hide header on specific pages */}
      {pathname !== "/about" &&
        pathname !== "/projects" &&
        pathname !== "/roadmap" && <SiteHeader />}
      {/* Conditionally apply padding to main */}
      <main
        className={
          pathname === "/ssh" ||
          pathname === "/cmd" ||
          pathname === "/about" ||
          pathname === "/projects" ||
          pathname === "/roadmap"
            ? ""
            : "pt-12"
        }
      >
        {children}
      </main>
      {/* Only show global command palette on pages that don't have their own command interface */}
      {pathname !== "/ssh" && pathname !== "/" && <GlobalCommandPalette />}
    </ThemeProvider>
  );
}
