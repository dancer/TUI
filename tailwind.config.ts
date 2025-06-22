import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "key-default-bg": "hsl(var(--key-default-bg))",
        "key-default-text": "hsl(var(--key-default-text))",
        "key-default-border": "hsl(var(--key-default-border))",
        "key-modifier-bg": "hsl(var(--key-modifier-bg))",
        "key-modifier-text": "hsl(var(--key-modifier-text))",
        "key-modifier-border": "hsl(var(--key-modifier-border))",
        "key-pressed-bg": "hsl(var(--key-pressed-bg))",
        "key-pressed-text": "hsl(var(--key-pressed-text))",
        "key-special-highlight-bg": "hsl(var(--key-special-highlight-bg))",
        "key-special-highlight-text": "hsl(var(--key-special-highlight-text))",
        "keyboard-case-from": "hsl(var(--keyboard-case-from))",
        "keyboard-case-to": "hsl(var(--keyboard-case-to))",
        "keyboard-plate-bg": "hsl(var(--keyboard-plate-bg))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        blink: {
          "0%, 100%": { backgroundColor: "hsl(var(--foreground))" },
          "50%": { backgroundColor: "transparent" },
        },
        ssh_blink: {
          "0%, 100%": { backgroundColor: "hsl(var(--terminal-cursor))" },
          "50%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blink: "blink 1s step-end infinite",
        "ssh-blink": "ssh_blink 1s step-end infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
