import type React from "react";
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "tui.cat",
  description:
    "A curated space for discovering, building, and sharing open-source terminal UI applications.",
  generator: "v0.dev",
  metadataBase: new URL("https://tui.cat"),
  openGraph: {
    title: "tui.cat",
    description:
      "A curated space for discovering, building, and sharing open-source terminal UI applications.",
    url: "https://tui.cat",
    siteName: "tui.cat",
    images: [
      {
        url: "/tui.png",
        width: 1200,
        height: 630,
        alt: "tui.cat - Terminal UI Applications",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "tui.cat",
    description:
      "A curated space for discovering, building, and sharing open-source terminal UI applications.",
    images: ["/tui.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  other: {
    "theme-color": "#f5f5f5",
    "color-scheme": "light dark", 
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "tui.cat",
  },
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
