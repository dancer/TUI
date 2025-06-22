import type React from "react";
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "TUI",
  description:
    "Create, share, and discover open-source terminal UI applications.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-mono">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
