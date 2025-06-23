import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Code,
  Users,
  Zap,
  Target,
  Lightbulb,
  GitBranch
} from "lucide-react";
import { PageSidebar } from "@/components/page-sidebar";

export const metadata: Metadata = {
  title: "Roadmap - tui.cat",
  description:
    "Development roadmap and future plans for tui.cat projects - see what's coming next in terminal interface development.",
};

interface RoadmapItem {
  id: string;
  title: string;
  description: React.ReactNode;
  status: "completed" | "in-progress" | "planned" | "future";
  quarter?: string;
  category: "platform" | "projects" | "community" | "tools";
  icon?: React.ReactNode;
}

const roadmapItems: RoadmapItem[] = [
  {
    id: "01",
    title: "Enhanced SSH Terminal",
    description:
      "Improve WebSocket SSH implementation with better error handling, session persistence, and terminal emulation features.",
    status: "in-progress",
    quarter: "Q1 2025",
    category: "platform",
    icon: <Terminal className="w-4 h-4" />,
  },
  {
    id: "02", 
    title: "Global Command System",
    description:
      "Expand command palette functionality with plugin architecture, custom commands, and cross-page state management.",
    status: "planned",
    quarter: "Q1 2025",
    category: "platform",
    icon: <Code className="w-4 h-4" />,
  },
  {
    id: "03",
    title: "Theme System Overhaul",
    description:
      "Redesign theme architecture with custom CSS properties, theme editor, and community theme sharing.",
    status: "planned",
    quarter: "Q2 2025", 
    category: "platform",
    icon: <Lightbulb className="w-4 h-4" />,
  },
  {
    id: "04",
    title: "Performance Optimization",
    description:
      "Implement code splitting, lazy loading, and optimize bundle size for faster page loads and better UX.",
    status: "planned",
    quarter: "Q2 2025",
    category: "platform",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "05",
    title: "API Documentation",
    description:
      "Create comprehensive API docs for tui.cat platform, including WebSocket protocols and command interfaces.",
    status: "planned",
    quarter: "Q3 2025",
    category: "platform",
    icon: <Terminal className="w-4 h-4" />,
  },
  {
    id: "06",
    title: "Mobile Experience",
    description:
      "Optimize terminal interfaces for mobile devices with touch-friendly controls and responsive layouts.",
    status: "planned",
    quarter: "Q3 2025",
    category: "platform",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "07",
    title: "Analytics & Insights",
    description:
      "Implement privacy-focused analytics to understand usage patterns and improve user experience.",
    status: "future",
    quarter: "Q4 2025",
    category: "platform",
    icon: <Target className="w-4 h-4" />,
  },
  {
    id: "08",
    title: "Community Features",
    description:
      "Add user profiles, command sharing, and collaborative features to foster the TUI development community.",
    status: "future",
    quarter: "Q4 2025",
    category: "community",
    icon: <Users className="w-4 h-4" />,
  },
];

const categoryColors = {
  platform: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  projects: "bg-green-500/10 text-green-600 border-green-500/20", 
  community: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  tools: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const statusColors = {
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  "in-progress": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  planned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  future: "bg-muted/30 text-muted-foreground border-border",
};

export default function RoadmapPage() {
  return (
    <div className="min-h-[calc(100vh-3rem)] w-full font-mono bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <div className="flex gap-8">
          {/* Sidebar */}
          <PageSidebar currentPage="roadmap" />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="w-full max-w-4xl mx-auto mb-16">
              <div className="text-center border-b border-border pb-8">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-8">
                    <span className="tracking-wider">PLATFORM ROADMAP</span>
                  <span className="tracking-wider">
                    INFRASTRUCTURE & COMMUNITY DEVELOPMENT
                  </span>
                  </div>
                
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    Our platform roadmap focuses on enhancing tui.cat's core
                    infrastructure, user experience, and community features.
                    These improvements will strengthen the foundation for all
                    TUI development and provide better tools for the terminal
                    interface community.
                  </p>
                  
                  <div className="py-8">
                    <h1 className="text-4xl sm:text-5xl font-medium text-primary mb-4 tracking-tight">
                      Platform Roadmap
                    </h1>
                    <p className="text-base text-muted-foreground italic font-light">
                      Enhancing tui.cat's infrastructure and community features.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-4xl mx-auto">
              <div 
                className="bg-background border border-border rounded-lg shadow-sm p-8"
                style={{
                  backgroundImage: `radial-gradient(circle, rgb(var(--muted-foreground) / 0.08) 1px, transparent 1px)`,
                  backgroundSize: "16px 16px",
                }}
              >
                <div className="space-y-6">
                  {roadmapItems.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-light text-primary/60 w-6">
                            {item.id}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {item.title}
                          </span>
                          {item.quarter && (
                            <span className="text-[0.6rem] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                              {item.quarter}
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 text-[0.6rem] rounded-full font-medium tracking-wider border ${statusColors[item.status]}`}
                        >
                          {item.status.replace("-", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="pl-9">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="https://github.com/dancer/tui"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium"
                    >
                      <GitBranch className="w-3 h-3 mr-2" />
                      Contribute on GitHub
                    </Link>
                    <Link
                      href="/projects"
                      className="inline-flex items-center justify-center px-4 py-2 text-xs border border-border rounded hover:bg-muted/20 transition-colors font-medium"
                    >
                      View Current Projects
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-12 border-t border-border mt-16">
                <div className="text-center space-y-4">
                  <p className="text-xs text-muted-foreground tracking-wider">
                    PLATFORM • INFRASTRUCTURE • COMMUNITY DRIVEN
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Strengthening the foundation for terminal interface
                    development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
