"use client";

import type React from "react";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import { GlobalCommandPalette } from "@/components/global-command-palette";
import { MobileNavDropdown } from "@/components/mobile-nav-dropdown";
import { ThemeMeta } from "@/components/theme-meta";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const getCurrentPage = (): "about" | "projects" | "roadmap" | null => {
    if (pathname === "/about") return "about";
    if (pathname === "/projects") return "projects";
    if (pathname === "/roadmap") return "roadmap";
    return null;
  };
  
  const currentPage = getCurrentPage();

  return (
    <ThemeProvider defaultTheme="geist" storageKey="tui-cat-theme">
      <ThemeMeta />
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
      
      {/* Mobile Navigation - only show on pages with sidebars */}
      {currentPage && <MobileNavDropdown currentPage={currentPage} />}
    </ThemeProvider>
  );
}
