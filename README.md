# tui.cat

> A curated space for discovering, building, and sharing open-source terminal UI applications

## ▌About

tui.cat is a modern web platform that bridges the gap between traditional terminal interfaces and contemporary web experiences. Built with Next.js and TypeScript, it provides an authentic terminal environment directly in your browser.

## ▌Features

### Terminal Experience
- ◆ Real SSH connections via WebSocket proxy
- ◆ Session persistence with 24-hour auto-reconnection
- ◆ Tab completion and command history

### Theming System
- ◆ 11 terminal themes
- ◆ Live theme preview during selection
- ◆ Catppuccin, Nord, Tokyo Night, Gruvbox, and more

### Navigation
- ◆ Command-driven interface with dot notation (.ssh, .help)
- ◆ Click anywhere and type . to open navigation
- ◆ Global keyboard shortcuts
- ◆ Interactive command palette

## ▌Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS + Geist Mono |
| Terminal | xterm.js + ansi-to-html |
| Backend | WebSocket + SSH2 |
| UI | Radix UI + Lucide Icons |

## ▌Quick Start

```bash
# Clone the repository
git clone https://github.com/dancer/tui.git
cd tui

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev
```

## ▌Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
# VPS SSH Server Configuration
VPS_SSH_SERVER_URL=ws://your-server-ip:3001
```

## ▌Roadmap

### Current Development

**◆ Implementing xterm.js integration**
- ├─ Enhanced cursor position support
- ├─ Improved hex color rendering
- ├─ Better terminal sequence handling
- └─ Advanced text selection and copy/paste

**◆ SSH proxy server optimizations**

**◆ Extended ANSI sequence compatibility**

**◆ Mobile terminal interface improvements**

## ▌Available Commands

| Category | Commands |
|----------|----------|
| Navigation | `.ssh` `.help` `.about` `.projects` `.roadmap` |
| Terminal | `ssh` `theme` `neo` `clear` `ls` `cd` `cat` `exit` |
| Shortcuts | `Esc` (Home) `?` (Help) `.` (Navigation) |

## ▌Project Structure

```
tui/
├── app/                # Next.js app router pages
│   ├── ssh/            # SSH terminal interface
│   ├── cmd/            # Command reference
│   └── api/            # API routes for SSH proxy
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
└── server/             # SSH WebSocket server
```

## ▌Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ▌License

Open source under the MIT License.

---

> **Built for terminal enthusiasts by terminal enthusiasts** 