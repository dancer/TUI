import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Code,
  Users,
  Zap,
  CheckCircle,
  GitBranch,
  Lightbulb,
  Target,
  ExternalLink,
  Github,
} from "lucide-react";
import { PageSidebar } from "@/components/page-sidebar";

export const metadata: Metadata = {
  title: "Projects - tui.cat",
  description:
    "Open-source TUI applications and projects we're building - terminal interfaces that celebrate efficiency and craftsmanship.",
};

interface ProjectItem {
  id: string;
  title: string;
  description: React.ReactNode;
  status: "in-development" | "planning" | "released";
  tech: string[];
  github?: string;
  icon?: React.ReactNode;
}

const projects: ProjectItem[] = [
  {
    id: "discord-tui",
    title: "Discord TUI",
    description:
      "A terminal-based Discord client that brings the full Discord experience to the command line. Built with modern TUI frameworks, it features real-time messaging, server navigation, voice channel integration, and a keyboard-driven interface that prioritizes efficiency over visual clutter.",
    status: "in-development",
    tech: ["Rust", "Ratatui", "Discord API", "Tokio"],
    github: "https://github.com/dancer/discord-tui",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "aisdk-tui",
    title: "AI SDK TUI",
    description:
      "A terminal interface for interacting with Vercel's AI SDK, enabling developers to test, debug, and experiment with AI models directly from the command line. Features model switching, conversation management, and real-time streaming responses in a keyboard-driven interface.",
    status: "planning",
    tech: ["TypeScript", "AI SDK", "Ink", "React"],
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "terminal-file-manager",
    title: "Terminal File Manager",
    description:
      "A blazingly fast file manager built for the terminal with vim-like keybindings, fuzzy search, and extensible plugin architecture. Designed to replace traditional GUI file managers for power users who live in the terminal.",
    status: "planning",
    tech: ["Go", "Bubble Tea", "Cobra CLI"],
    icon: <Terminal className="w-5 h-5" />,
  },
  {
    id: "tui-toolkit",
    title: "TUI Development Toolkit",
    description:
      "A comprehensive toolkit and component library for building beautiful terminal user interfaces. Includes pre-built components, themes, and utilities that make TUI development accessible to developers of all skill levels.",
    status: "planning",
    tech: ["TypeScript", "Node.js", "Ink", "React"],
    icon: <Code className="w-5 h-5" />,
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-[calc(100vh-3rem)] w-full font-mono bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <div className="flex gap-8">
          {/* Sidebar */}
          <PageSidebar currentPage="projects" />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="w-full max-w-4xl mx-auto mb-16">
              <div className="text-center border-b border-border pb-8">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-8">
                  <span className="tracking-wider">TUI PROJECTS</span>
                  <span className="tracking-wider">
                    OPEN-SOURCE TERMINAL APPLICATIONS
                  </span>
                </div>

                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    We build terminal user interfaces that celebrate the
                    elegance and efficiency of keyboard-driven computing. Our
                    projects are open-source, crafted with attention to detail,
                    and designed to prove that constraint breeds creativity.
                  </p>

                  <div className="py-8">
                    <h1 className="text-4xl sm:text-5xl font-medium text-primary mb-4 tracking-tight">
                      TUI Projects
                    </h1>
                    <p className="text-base text-muted-foreground italic font-light">
                      Building the future of terminal interfaces, one
                      application at a time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-4xl mx-auto space-y-16">
              {/* Introduction */}
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  <strong>Terminal User Interfaces</strong> represent a return
                  to focused, distraction-free computing. We're building
                  applications that harness the power of the command line while
                  providing intuitive, keyboard-driven experiences that rival
                  their GUI counterparts.
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Each project is crafted with modern development practices,
                  comprehensive documentation, and a commitment to open-source
                  collaboration. We believe the best software emerges from
                  community-driven development and shared knowledge.
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our current focus is on applications that bridge the gap
                  between traditional terminal tools and modern user
                  expectations—proving that efficiency and elegance can coexist.
                </p>
              </div>

              {/* Current Projects */}
              <div className="space-y-12">
                <h2 className="text-2xl font-light text-primary tracking-tight">
                  Current projects
                </h2>

                <div className="space-y-12">
                  {projects.map((project, index) => (
                    <div key={project.id} className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-12 h-12 rounded-lg bg-muted/20 flex items-center justify-center text-primary/60">
                            {project.icon}
                          </div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-medium text-foreground tracking-tight">
                              {project.title}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium tracking-wider ${
                                project.status === "in-development"
                                  ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                                  : project.status === "planning"
                                    ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                    : "bg-green-500/10 text-green-600 border border-green-500/20"
                              }`}
                            >
                              {project.status.replace("-", " ").toUpperCase()}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 text-xs bg-muted/30 text-muted-foreground rounded font-mono"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Philosophy */}
              <div className="space-y-8">
                <h2 className="text-2xl font-light text-primary tracking-tight">
                  Our approach
                </h2>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-foreground flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary/60" />
                      <span>Open Source First</span>
                    </h3>
                    <div className="pl-6">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        All our projects are open-source from day one. We
                        believe in transparent development, community
                        contributions, and shared knowledge. Every line of code
                        is available for inspection, modification, and
                        improvement.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-foreground flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary/60" />
                      <span>Performance & Efficiency</span>
                    </h3>
                    <div className="pl-6">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Terminal applications should be fast, responsive, and
                        resource-efficient. We optimize for minimal memory
                        usage, quick startup times, and smooth interactions—even
                        on older hardware or resource-constrained environments.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-foreground flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary/60" />
                      <span>Keyboard-Driven Design</span>
                    </h3>
                    <div className="pl-6">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Every interface is designed with keyboard navigation as
                        the primary interaction method. We create intuitive key
                        bindings, comprehensive shortcuts, and workflows that
                        keep users' hands on the keyboard for maximum
                        productivity.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-foreground flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary/60" />
                      <span>Modern Development Practices</span>
                    </h3>
                    <div className="pl-6">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We use contemporary programming languages, frameworks,
                        and tools while maintaining the Unix philosophy of doing
                        one thing well. Comprehensive testing, clear
                        documentation, and maintainable code are non-negotiable
                        aspects of our development process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contributing */}
              <div className="bg-muted/20 rounded-lg p-8 space-y-6">
                <h2 className="text-xl font-light text-primary tracking-tight">
                  Get involved
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  We welcome contributions from developers of all skill levels.
                  Whether you're interested in adding features, fixing bugs,
                  improving documentation, or suggesting new project ideas,
                  there's a place for you in our community.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="https://github.com/dancer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm border border-border rounded hover:bg-muted/20 transition-colors font-medium"
                  >
                    Learn More About Us
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-12 border-t border-border">
                <div className="text-center space-y-4">
                  <p className="text-xs text-muted-foreground tracking-wider">
                    OPEN SOURCE • TERMINAL INTERFACES • COMMUNITY DRIVEN
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Building applications that prove the terminal is the most
                    efficient interface for serious work.
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
