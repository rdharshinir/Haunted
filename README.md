# 🧠 HUNTER — Emotion-Aware AI Tutor

> India's first hyper-local, emotion-aware, multilingual AI tutoring platform built for rural students on low-end Android phones.

[![Built with React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![Claude AI](https://img.shields.io/badge/Claude-API-black?logo=anthropic)](https://anthropic.com)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Voice Control](#voice-control)
- [Multilingual Support](#multilingual-support)
- [Feature Workflows](#feature-workflows)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Accessibility](#accessibility)
- [API Configuration](#api-configuration)

---
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/51a83449-8296-40e6-b2c1-d1abdf7c64eb" />

## Overview

HUNTER adapts its teaching style in real-time based on student emotions detected through voice patterns and text analysis. Designed for Tier-2/3 India — works on ₹5,000 phones, 2G connections, and supports 6 Indian languages.

**Key Differentiators:**
- Voice-based stress detection (no camera needed)
-  Tanglish (Tamil+English) mentor mode with village-life metaphors
-  District-level job radar mapped to skills learned
-  AI Dream Project Generator personalized to local industries
-  WhatsApp-native lesson UI that feels familiar
-  Full multilingual support with speech recognition & TTS

---

## Features

### 1. Secure Authentication
- Email/password login and registration
- SHA-256 hashed passwords stored locally via Web Crypto API
- 7-day session persistence with auto-expiry
- Progress saved per user account

### 2. 🎤 Voice Emotion Scanner
- Web Speech API mic-based recording
- Detects stress via: silence gaps >3s, speech speed (WPM), filler words
- Live animated waveform visualization
- Real-time stress percentage meter
- Graceful fallback for unsupported browsers

### 3.  Skill DNA Card
- SVG hexagonal radar chart with 6 axes (Speed, Accuracy, Confidence, Creativity, Consistency, Resilience)
- Unique color gradient based on dominant emotion
- Holographic shine animation
- Shareable via WhatsApp/LinkedIn using Web Share API
- Unique badge ID per student

### 4.  Tanglish Mentor Mode
- 5 Tamil-English metaphors mapping CS concepts to village life:
  - API → Swiggy delivery 🛵
  - For-loop → Tiffin box route 📦
  - ML → Amma's cooking patterns 🍳
  - Database → Provision kadai notebook 📒
  - Git → Pencil+eraser with history ✏️
- Auto-activates when confusion/stress detected
- Claude API prompt enhanced for Tanglish responses

### 5.  Guardian EQ Live Dashboard
- SVG river-flow chart — width and color change with emotions
- Wide/blue (calm) → narrow/red (stressed) → flat/gray (bored)
- Topic markers along timeline
- Summary stats: confidence %, stress peaks, session duration
- Export for guardians/educators

### 6.  Confusion Heatmap
- Per-topic color-coded struggle bars
- AI-generated educator insights:
  - "API caused the most confusion — needs re-teaching"
  - "For-loop was clearly understood — move to advanced"
- Exportable report for teachers and parents

### 7.  Boss Level Challenges
- 2 timed real-world challenges:
  - Boss 1: "Build a BMI Calculator" (5 min) → 🏗️ Logic Architect badge
  - Boss 2: "Write a Tanglish Tea-Order Bot Prompt" (3 min) → 🧙 Prompt Wizard badge
- Circular countdown timer with color transitions
- Claude API evaluation with JSON scoring
- NFT-style badges with holographic animation

### 8.  Peer Duel Mode
- vs Bot (simulated opponent) or vs Friend (BroadcastChannel)
- 5 rounds, 30s per question
- Split-screen scoreboard with VS badge
- Cooperative hint at 15s if both players struggle
- Rematch option with score tracking

### 9. WhatsApp-Native Lesson UI
- Full WhatsApp-style chat interface
- Green header with online status
- Chat bubbles with timestamps and read receipts (✓✓)
- Typing indicator animation
- Dark wallpaper pattern
- Toggle between card view ↔ chat view on any topic

### 10.  District-Level Job Radar
- 10 Tamil Nadu districts: Coimbatore, Chennai, Madurai, Tirupur, Salem, Trichy, Erode, Thanjavur, Vellore, Tirunelveli
- 40+ real MSME/MNC/Startup/Govt jobs with salaries
- Skill-matched to topics the student has mastered
- Search and filter by district
- Match percentage bar for each job

### 11.  Dream Project Generator
- Student types their interest ("I care about textiles")
- Claude AI generates a full project brief:
  - Title, tagline, problem statement
  - Solution, tech stack, 4 build steps
  - Timeline, district mapping, impact statement
- Fallback seeds for 10 industries (textile, agriculture, healthcare, etc.)
- Shareable project brief via clipboard

### 12.  Multilingual Support
- 6 languages: English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം)
- UI strings translated for all languages
- Web Speech API recognition adapts to selected language
- Text-to-Speech reads AI responses in chosen language
- Claude API prompt instructs responses in preferred language

### 13.  Platform-Wide Voice Control
- Global voice command system across all tabs
- Navigation: "Go to Duel", "Go to Dashboard", "Open Profile"
- Lesson: "Submit", "Next Topic", "Retry"
- Modes: "Tanglish Mode", "WhatsApp Mode", "Voice Mode"
- System: "Help", "Logout"
- Floating mic button with last-command display
- Voice commands help modal

### 14.  Text-to-Speech (TTS)
- Toggle TTS on/off from any screen
- AI responses spoken aloud in selected language
- Uses Web Speech Synthesis API
- Automatic voice matching for Indian languages

---

## Architecture

```
┌─────────────────────────────────────────┐
│              LoginScreen                │
│         (SHA-256 Auth Gate)             │
└─────────────┬───────────────────────────┘
              │ authenticated
┌─────────────▼───────────────────────────┐
│           App.jsx (Router)              │
│  ┌─────┬──────┬────────┬──────┬─────┐  │
│  │Learn│ Duel │  EQ    │Discov│Prof │  │
│  │     │      │Dashboard│ery  │ile  │  │
│  └──┬──┴──┬───┴───┬────┴──┬──┴──┬──┘  │
│     │     │       │       │     │      │
│  Lesson  Peer   River   Dream  DNA    │
│  +WA    Duel   +Heat   Proj  Card    │
│  Chat          map    +Jobs          │
└─────────────────────────────────────────┘
     ▲                    ▲
     │   VoiceControlBar  │  LanguageSelector
     │   (floating, all)  │  (header, all)
     │                    │
┌────┴────────────────────┴───────────────┐
│           Utility Layer                 │
│  auth.js │ voiceControl.js │ multi.js  │
│  emotionDetector.js │ voiceScanner.js  │
│  peerConnection.js                     │
└─────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash

npm install
npm run dev
```

Open **http://localhost:5173/** in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Authentication

### Registration Flow
1. Select language on login screen (top-right selector)
2. Click **Register** tab
3. Enter name, email, password (min 6 chars)
4. Password is SHA-256 hashed using Web Crypto API before storage
5. Session created with 7-day expiry
6. Redirected to Welcome screen

### Login Flow
1. Click **Login** tab
2. Enter email and password
3. Credentials verified against hashed password
4. Session restored, progress loaded

### Security
- Passwords never stored in plaintext
- `crypto.subtle.digest('SHA-256')` with salt
- Sessions auto-expire after 7 days
- Logout clears all session data

---

## Voice Control

### Activation
- Click the floating 🎤 button (top-right corner) on any screen
- Red pulsing animation indicates active listening
- Last recognized command displayed in tooltip

### Available Commands

| Category | Commands |
|----------|----------|
| **Navigation** | "Go to Learn", "Go to Duel", "Go to Dashboard", "Go to Discover", "Go to Profile" |
| **Lesson** | "Submit", "Next Topic", "Retry" |
| **Modes** | "Tanglish Mode", "WhatsApp Mode", "Card Mode", "Voice Mode", "Text Mode" |
| **System** | "Help", "Logout" |

### Help
- Say **"Help"** or click the **?** button to see all commands
- Commands work in the selected language

---

## Multilingual Support

### Supported Languages

| Language | Code | Speech Recognition | TTS | UI Strings |
|----------|------|-------------------|-----|------------|
| English | en-IN | ✅ | ✅ | ✅ |
| Tamil | ta-IN | ✅ | ✅ | ✅ |
| Hindi | hi-IN | ✅ | ✅ | ✅ |
| Telugu | te-IN | ✅ | ✅ | ✅ |
| Kannada | kn-IN | ✅ | ✅ | ✅ |
| Malayalam | ml-IN | ✅ | ✅ | ✅ |

### How It Works
1. **Language Selector** — Dropdown on login screen and welcome screen
2. **UI Strings** — All buttons, labels, and prompts switch to selected language
3. **Speech Recognition** — Web Speech API `lang` parameter set to selected language
4. **TTS** — AI responses spoken in selected language via SpeechSynthesis API
5. **Claude API** — System prompt includes language instruction for natural responses
6. **Persistence** — Language preference saved to user profile

---

## Feature Workflows

### Learning Flow
```
Register/Login → Welcome (select language) → Start Learning
  → Topic Card (card or WhatsApp view)
    → Text input OR Voice input
      → Emotion Detection (text + voice fusion)
        → If STRESSED → Breather (30s) → Tanglish hint
        → If CONFUSED → Tanglish auto-on → Metaphor shown
        → If CONFIDENT → Next topic
        → If BORED → Mini-challenge
      → AI Response (in selected language)
      → TTS reads response (if enabled)
    → After Topic 3 → Boss Challenge 1
    → After Topic 5 → Boss Challenge 2
  → Complete → Skill DNA Card → Share
```

### Duel Flow
```
Duel Tab → Choose: vs Bot or vs Friend
  → vs Bot → 5 rounds, 30s each
    → Answer questions → Score tracked
    → Hint at 15s if stuck
    → Match result → Rematch or Exit
  → vs Friend → Generate room code → Share
```

### Discover Flow
```
Discover Tab → Dream Project Generator
  → Type interest ("I care about textiles")
  → Claude generates project brief
  → Copy/Share brief
  ↓
Job Radar → Select district → Browse jobs
  → Jobs sorted by skill match
  → Green highlights = matching skills
```

### EQ Dashboard Flow
```
EQ Tab → River-flow chart (live during session)
  → Emotion transitions visualized
  → Topic markers on timeline
  ↓
Confusion Heatmap → Per-topic struggle bars
  → AI insights for educators
  → Export report
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 + Vanilla CSS |
| Icons | Lucide React |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Voice | Web Speech API (Recognition + Synthesis) |
| Auth | Web Crypto API (SHA-256) + localStorage |
| State | React useState/useRef (no external deps) |
| Peer | BroadcastChannel API |

---

## File Structure

```
hunter-app/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                           Entry point
│   ├── App.jsx                            Router + global state (29KB)
│   ├── index.css                          Design tokens + imports
│   ├── styles/
│   │   ├── animations.css                 30+ keyframe animations
│   │   └── components.css                 600+ lines of component styles
│   ├── utils/
│   │   ├── auth.js                        SHA-256 auth + sessions
│   │   ├── voiceControl.js                Global voice command engine
│   │   ├── multilingual.js                6-language TTS + translations
│   │   ├── voiceScanner.js                Web Speech API wrapper
│   │   ├── emotionDetector.js             Text + voice emotion blend
│   │   └── peerConnection.js              BroadcastChannel + sim bot
│   ├── data/
│   │   ├── topics.js                      5 topics, 2 bosses, 8 duel Qs
│   │   ├── tanglishMetaphors.js           5 Tamil-English metaphors
│   │   └── jobsData.js                    10 districts, 40+ jobs, seeds
│   └── components/
│       ├── LoginScreen.jsx                Auth UI (login/register)
│       ├── VoiceControlBar.jsx            Floating mic + help modal
│       ├── LanguageSelector.jsx           Language dropdown
│       ├── VoiceScanner.jsx               Mic + waveform + stress
│       ├── SkillDNACard.jsx               Hexagonal radar chart
│       ├── TanglishMentor.jsx             Tamil metaphor panel
│       ├── EQLiveDashboard.jsx            River-flow emotion chart
│       ├── ConfusionHeatmap.jsx           Per-topic struggle map
│       ├── BossChallenge.jsx              Timed challenges + badges
│       ├── PeerDuel.jsx                   Competitive quiz mode
│       ├── WhatsAppLesson.jsx             Chat-style lesson UI
│       ├── JobRadar.jsx                   District job matching
│       ├── DreamProjectGenerator.jsx      AI project brief generator
│       └── NavigationBar.jsx              5-tab bottom nav
```

---

## Accessibility

- **Keyboard Navigation** — All interactive elements focusable with `focus-visible` outlines
- **Reduced Motion** — `prefers-reduced-motion` media query disables all animations
- **Screen Reader** — Semantic HTML with proper heading hierarchy
- **Color Contrast** — All text meets WCAG AA contrast ratios on dark background
- **Touch Targets** — Minimum 44px touch targets for mobile
- **Voice-First** — Entire platform navigable via voice commands
- **Multilingual** — 6 Indian language support for non-English speakers

---

## API Configuration

Set your Claude API key before the app loads:

```html
<script>
  window.__CLAUDE_API_KEY = 'your-anthropic-api-key';
</script>
```

All features work without an API key using intelligent fallback responses.

---

## Build Output

```
dist/index.html                   0.94 KB
dist/assets/index-*.css          44.09 KB (9.29 KB gzip)
dist/assets/index-*.js          312.98 KB (96.92 KB gzip)

✓ built in 13.38s — zero errors
```

---

## License

MIT

---

*Built for rural India. Made with 💜 by HAUNTER Team.*
