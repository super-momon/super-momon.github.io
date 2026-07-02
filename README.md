# Mark Raymond M. Ayade — Portfolio & Tech Quiz Hub

Welcome to the official repository for **Mark Raymond M. Ayade's** professional portfolio website and interactive technical quiz hub. This is a highly optimized, modern, and interactive single-page web application built with **Next.js (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

The site has two main components:
1. **Developer Portfolio**: A professional showcase of background, experience, education, skills, projects, and contact channels.
2. **Interactive Tech Quiz**: A comprehensive, multi-topic quiz game complete with difficulty levels, dynamic point scaling, different game modes, and a live Supabase leaderboard backend.

---

## 🌟 Key Features

### 1. Modern Developer Portfolio
Designed with premium dark-themed aesthetics, glassmorphism, subtle micro-animations, and fluid responsive layouts:
- **Hero & Landing**: Impressive background typography, character-by-character animations, and a real-time availability indicator.
- **Interactive About Me**: Grayscale-to-color visual transitions, brief stats (years of experience, technology index), and expertise highlights.
- **Experience Timeline**: A tabbed interactive timeline of professional history at **Talleco.com Inc. / JobTarget PH**, detailing progression from Junior to Mid-level and Full Stack Software Developer.
- **Interactive Projects Showcase**: Custom cards with interactive mouse-spotlight effects spotlighting key full-stack client-facing/internal projects and their technical tag clouds.
- **Skills Matrix**: Categorized tags grouping full-stack languages, libraries, cloud infrastructure, and databases.
- **Education Section**: Clean layout showcasing degrees and certifications.
- **Contact Form**: An integrated channel for users to reach out directly.

### 2. Interactive Tech Quiz Game
A feature-rich technical quiz engine designed to test software development and CS knowledge:
- **12 Specialized Categories**:
  - JavaScript, TypeScript, Python, React, CSS & HTML, Data Structures, UI/UX, Databases, Git, General CS, .NET, and AWS.
- **3 Diverse Game Modes**:
  - 💀 **Survival (Sudden Death)**: Game over on a single incorrect answer or question timer running out.
  - ❤️ **Lives (Standard)**: Play with 3 lives. Lose a life per incorrect answer or timer running out.
  - 🏁 **Best of 100 (Marathon)**: Go through exactly 100 questions. No lives limit—highest score wins.
- **Point Scaling by Difficulty**:
  - Easy: `+1 point`
  - Medium: `+2 points`
  - Hard: `+3 points`
  - Extra-Hard: `+5 points`
- **Dynamic Interface**:
  - 15-second per-question timer with countdown visuals.
  - Interactive answer selection cards.
  - Final results screen showing average response time, accuracy, total score, and custom feedback.
- **Live Leaderboard**:
  - Persistent nickname selection modal.
  - Global high-scores database powered by **Supabase**.
  - Top-15 high scores filtered per game mode.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Animations**: [Motion](https://motion.dev/) (`motion/react`) for smooth physics-based and keyframe transitions
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & CSS variables for premium visual aesthetics
- **Database/Backend**: [Supabase JS Client SDK](https://supabase.com/)
- **Icons**: [FontAwesome React Wrapper](https://fontawesome.com/)

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── games/
│   │   └── quiz/            # Tech Quiz pages, components, & leaderboard modal
│   ├── util/                # App utility functions
│   ├── globals.css          # Styling variables, tailwind directives, global base settings
│   ├── layout.tsx           # Base page layout structure & providers
│   └── page.tsx             # Home landing page aggregating portfolio sections
├── components/
│   ├── common/              # Common UI (Marquee, ThemeToggle, Notification, HighlightText)
│   ├── sections/            # Portfolio page components (Hero, About, Projects, Experience, Skills, Education, Contact)
│   ├── ClientPageWrapper.tsx# Wrapper dealing with client-side component hydrations
│   └── Navbar.tsx           # Highly polished interactive desktop & mobile navigation panel
├── data/
│   └── quiz/                # JSON Question banks for all 12 tech categories
├── hooks/
│   ├── useMagneticEffect.ts # Custom hook for magnetic hover interaction
│   └── useQuizGame.ts       # Central game engine hook (timer, lives, scoring, mode rules)
├── lib/
│   ├── analytics.ts         # User event logging and analytics helpers
│   ├── constants.ts         # Navigation and layout links constants
│   ├── leaderboard.ts       # Database fetch/submit operations for Supabase
│   └── supabase.ts          # Supabase client instantiation
└── types/                   # TypeScript schemas and definitions (quiz, leaderboard, navigation)
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed (v18+ recommended) along with `npm`, `yarn`, `pnpm`, or `bun`.

### 1. Setup Environment Variables

Create a `.env.local` file in the root directory. You will need to supply credentials for your Supabase backend to enable the quiz leaderboard feature:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Setup the Supabase Database

To support the quiz leaderboard, set up a table named `leaderboard` inside your Supabase project. You can run the following SQL schema in the Supabase SQL Editor:

```sql
create table leaderboard (
  id uuid default gen_random_uuid() primary key,
  nickname text not null,
  score integer not null,
  mode text not null,
  correct_count integer not null,
  total_answered integer not null,
  avg_time_per_question double precision not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexing for performance when fetching top-15 leaderboard scores by mode
create index leaderboard_mode_score_idx on leaderboard (mode, score desc);
```

### 3. Installation & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build the production package**:
   ```bash
   npm run build
   ```

4. **Run the production server**:
   ```bash
   npm start
   ```

---

## 🔒 License

This repository is private and is meant for portfolio demonstration purposes. All rights reserved by the author.
