import type React from "react";
import Link from "next/link";
import { BookOpen, Code, MapPin } from "lucide-react";
import { TerminalIcon } from "@/components/terminal-icon";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isExternal?: boolean;
  href?: string;
}

interface PageSidebarProps {
  currentPage: "about" | "projects" | "roadmap";
}

const navigationItems: NavigationItem[] = [
  {
    id: "about",
    label: "About",
    icon: <BookOpen className="w-3 h-3" />,
    isExternal: true,
    href: "/about",
  },
  {
    id: "projects",
    label: "Projects",
    icon: <Code className="w-3 h-3" />,
    isExternal: true,
    href: "/projects",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: <MapPin className="w-3 h-3" />,
    isExternal: true,
    href: "/roadmap",
  },
  {
    id: "home",
    label: "Home",
    icon: <TerminalIcon size={12} />,
    isExternal: true,
    href: "/",
  },
];

export function PageSidebar({ currentPage }: PageSidebarProps) {
  return (
    <div className="hidden lg:block w-56 flex-shrink-0">
      <div className="sticky top-20">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground tracking-wider font-medium">
              TUI INDUSTRIES
            </div>
            <nav className="space-y-1">
              {navigationItems.map((item, index) => {
                if (item.id === currentPage) {
                  return (
                    <div
                      key={item.id}
                      className="flex items-center space-x-2 text-sm text-foreground py-1"
                    >
                      <span className="text-primary/60">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  );
                }

                if (item.id === "home") {
                  return (
                    <div key={item.id}>
                      <div className="border-t border-border/30 my-2"></div>
                      <Link
                        href={item.href!}
                        className="inline-flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors py-1 group"
                      >
                        <span className="text-primary group-hover:text-primary/80 transition-colors">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </div>
                  );
                }

                return (
                  <div key={item.id}>
                    <Link
                      href={item.href!}
                      className="inline-flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors py-1 group"
                    >
                      <span className="text-primary group-hover:text-primary/80 transition-colors">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
