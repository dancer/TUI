import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Code,
  Users,
  Zap,
  CheckCircle
} from "lucide-react";
import { PageSidebar } from "@/components/page-sidebar";

export const metadata: Metadata = {
  title: "About - tui.cat",
  description:
    "The philosophy, mission, and story behind tui.cat - a practical approach to terminal interface development.",
};

interface CorePrinciple {
  title: string;
  content: React.ReactNode;
}

interface ManifestoItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

const corePrinciples: CorePrinciple[] = [
  {
    title: "Quality is our responsibility",
    content:
      "As engineers, we are solely responsible for the quality of what we build. It is up to us to develop judgment about when AI improves our outcomes and when it doesn't. We cannot outsource this responsibility to tools, even when those tools have a best-in-class UX craft.",
  },
  {
    title: "Craftsmanship is critical",
    content:
      "Quality software is the goal. AI gives us new leverage, but doesn't replace the need for taste and judgment. Instead, it amplifies the impact of engineering expertise by handling repetitive tasks, letting us focus on what matters: creating software that's both functional and elegant.",
  },
  {
    title: "The Case for Software Craftsmanship in the Era of TUIs",
    content:
      "Terminal interfaces demand precision, clarity, and intent. Every keystroke matters.",
  },
  {
    title: "Skills improve outcomes",
    content:
      "Working with agents to write code requires rigor, clarity, and intent. Learning to effectively direct AI tools is a skill that demands practice and refinement. Just as we've learned to master other tools in our stack, we need to develop expertise in collaborative development with intelligent systems.",
  },
  {
    title: "A new way to collaborate",
    content:
      "Traditional development tools asked us to be human-to-human workflows, not real-time interaction. Today's workflows demand tools that support rapid feedback loops, parallel agent conversations, and efficient review of AI-supported changes—all while maintaining code clarity and quality.",
  },
];

const manifestoData: ManifestoItem[] = [
  {
    id: "01",
    title: "Purpose",
    icon: <Terminal className="w-4 h-4" />,
    content:
      "tui.cat serves as the central nexus for Terminal User Interface development. We curate, create, and share open-source TUI applications that celebrate the elegance and efficiency of keyboard-driven interfaces. Our mission is to preserve and advance the art of terminal computing.",
  },
  {
    id: "02",
    title: "Philosophy",
    icon: <Code className="w-4 h-4" />,
    content:
      "We champion simplicity over complexity, efficiency over bloat, and craftsmanship over convenience. TUIs represent a return to focused, distraction-free computing where every keystroke has purpose. Our tools are designed to be both powerful and beautiful—proving that constraint breeds creativity.",
  },
  {
    id: "03",
    title: "Community",
    icon: <Users className="w-4 h-4" />,
    content: (
      <>
        This ecosystem thrives through collaborative development and knowledge
        sharing. We foster a community of developers, designers, and enthusiasts
        who understand that the command line is not just a tool—it's a
        philosophy.{" "}
        <Link
          href="https://github.com/dancer/tui"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary hover:text-foreground transition-colors group/link font-medium"
        >
          Contribute on GitHub
          <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </>
    ),
  },
  {
    id: "04",
    title: "Innovation",
    icon: <Zap className="w-4 h-4" />,
    content: (
      <>
        Created and maintained by{" "}
        <Link
          href="https://github.com/dancer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-foreground transition-colors font-medium"
        >
          @dancer
        </Link>
        , tui.cat represents the convergence of traditional terminal computing
        with modern web technologies. We bridge the gap between heritage and
        innovation, proving that the command line remains the most efficient
        interface for serious work.
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-3rem)] w-full font-mono bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <div className="flex gap-8">
          {/* Sidebar */}
          <PageSidebar currentPage="about" />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="w-full max-w-4xl mx-auto mb-16">
              <div className="text-center border-b border-border pb-8">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-8">
                  <span className="tracking-wider">TERMINAL ENGINEERING</span>
                  <span className="tracking-wider">
                    PRACTICAL APPLICATION OF CLI TO CREATE QUALITY SOFTWARE
                  </span>
                </div>

                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    Software development is changing and we find ourselves at a
                    convergence. Between the extremes of technological zealotry
                    ("all code will be AI-generated") and dismissive skepticism
                    ("AI-generated code is garbage") lies a more practical and
                    nuanced approach—one that is ours to discover together.
                  </p>

                  <div className="py-8">
                                  <h1 className="text-4xl sm:text-5xl font-medium text-primary mb-4 tracking-tight">
                Terminal Engineering
              </h1>
                    <p className="text-base text-muted-foreground italic font-light">
                      Combining human craftsmanship with AI tools to build
                      better software.
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
                  <strong>Terminal Engineering</strong> means integrating AI
                  into your existing development workflow. When quality software
                  is the goal, there is no substitute for a skilled engineer. It
                  is about enhancing what we can accomplish through thoughtful
                  collaboration.
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Perfecting our tools has always been essential to good
                  engineering. Traditional developer tools are predictable—they
                  give the same output for the same input. AI tools work
                  differently—they're powerful but stochastic.
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Learning to work effectively with this inconsistency is a new
                  engineering skill.
                </p>
              </div>

              {/* Philosophy Section */}
              <div className="space-y-8">
                <h2 className="text-2xl font-light text-primary tracking-tight">
                  Leverage, not magic
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  <em>Terminal Engineering</em> represents the integration of
                  two seemingly opposing approaches:
                </p>

                {/* Visual representation with more sophisticated diagrams */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground/80 tracking-wider">
                      TRADITIONAL
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        {[1, 0, 0, 1, 0, 1, 0].map((active, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs ${
                              active
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-muted-foreground/30 text-muted-foreground/50"
                            }`}
                          >
                            {active ? "1" : "0"}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        {[1, 1, 0, 1, 1, 0, 1].map((active, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                              active
                                ? "border-primary/60 bg-primary/5 text-primary/60"
                                : "border-muted-foreground/20 text-muted-foreground/40"
                            }`}
                          >
                            {active ? "1" : "0"}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground text-center mt-4">
                        Fast, stable, deterministic.
                        <br />
                        Predictable with predictive outcomes.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground/80 tracking-wider">
                      EMERGING
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                      <div className="relative h-32 flex items-center justify-center">
                        {/* Central CLI node */}
                        <div className="w-12 h-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center text-sm font-medium text-primary z-10">
                          CLI
                        </div>

                        {/* Surrounding nodes with different colors */}
                        <div className="absolute inset-0">
                          {[
                            {
                              x: "20%",
                              y: "20%",
                              color: "bg-green-500/20 border-green-500/40",
                              size: "w-6 h-6",
                            },
                            {
                              x: "80%",
                              y: "25%",
                              color: "bg-blue-500/20 border-blue-500/40",
                              size: "w-5 h-5",
                            },
                            {
                              x: "15%",
                              y: "70%",
                              color: "bg-yellow-500/20 border-yellow-500/40",
                              size: "w-7 h-7",
                            },
                            {
                              x: "75%",
                              y: "75%",
                              color: "bg-red-500/20 border-red-500/40",
                              size: "w-4 h-4",
                            },
                            {
                              x: "50%",
                              y: "10%",
                              color: "bg-purple-500/20 border-purple-500/40",
                              size: "w-5 h-5",
                            },
                            {
                              x: "10%",
                              y: "45%",
                              color: "bg-orange-500/20 border-orange-500/40",
                              size: "w-6 h-6",
                            },
                            {
                              x: "85%",
                              y: "50%",
                              color: "bg-pink-500/20 border-pink-500/40",
                              size: "w-5 h-5",
                            },
                          ].map((node, i) => (
                            <div
                              key={i}
                              className={`absolute ${node.size} rounded-full border ${node.color} animate-pulse`}
                              style={{
                                left: node.x,
                                top: node.y,
                                animationDelay: `${i * 0.2}s`,
                              }}
                            />
                          ))}
                        </div>

                        {/* Connecting lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-20">
                          <line
                            x1="50%"
                            y1="50%"
                            x2="20%"
                            y2="20%"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                          <line
                            x1="50%"
                            y1="50%"
                            x2="80%"
                            y2="25%"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                          <line
                            x1="50%"
                            y1="50%"
                            x2="15%"
                            y2="70%"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                          <line
                            x1="50%"
                            y1="50%"
                            x2="75%"
                            y2="75%"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        Fast, stochastic, expressive.
                        <br />
                        Powerful but requires expertise.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom diagram */}
                <div className="bg-muted/20 rounded-lg p-6 mt-8">
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center text-sm font-medium text-primary mb-2">
                        0.1
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Structured
                      </div>
                    </div>
                    <div className="flex-1 h-px bg-border"></div>
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center text-base font-medium text-primary mb-2">
                        0.7
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Balanced
                      </div>
                    </div>
                    <div className="flex-1 h-px bg-border"></div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full border-2 border-primary/60 bg-primary/5 flex items-center justify-center text-sm font-medium text-primary/60 mb-2">
                        0.9
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Creative
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center mt-4">
                    Balancing automation between the predictable and
                    unpredictable.
                  </div>
                </div>
              </div>

              {/* Core Principles Section */}
              <div className="space-y-8">
                <h2 className="text-2xl font-light text-primary tracking-tight">
                  Core principles
                </h2>

                <div className="space-y-8">
                  {corePrinciples.map((principle, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="text-base font-medium text-foreground flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary/60" />
                        <span>{principle.title}</span>
                      </h3>
                      <div className="pl-6">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {principle.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Let's learn together section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-primary tracking-tight">
                  Let's learn together
                </h2>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI agents have not existed for very long. We've already
                    learned a lot about how best to work with them, but there's
                    much to learn. What's more, the tools themselves continue to
                    improve, which creates ever moving goalposts in our pursuit
                    of understanding.
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In this rapidly evolving environment, how can we determine
                    which skills and techniques work best with which tools? The
                    same way we always have: sharing knowledge with one another.
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every other week we'll be bringing in experts to teach
                    things out with us.
                  </p>
                </div>
              </div>

              {/* Manifesto Sections */}
              <div className="space-y-12">
                <h2 className="text-2xl font-light text-primary tracking-tight">
                  Our approach
                </h2>
                {manifestoData.map((item, index) => (
                  <div key={item.id} className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-light text-primary/60">
                        {item.id}
                      </span>
                      <div className="text-primary/60">{item.icon}</div>
                      <h3 className="text-lg font-medium text-foreground tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                    <div className="pl-8">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-12 border-t border-border">
                <div className="text-center space-y-4">
                  <p className="text-xs text-muted-foreground tracking-wider">
                    OPEN SOURCE • DEVELOPER TOOLS • COMMAND-LINE EXCELLENCE
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Building the future of terminal interfaces, one keystroke at
                    a time.
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
