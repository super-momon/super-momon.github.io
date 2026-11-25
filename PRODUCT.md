# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Engineering Hiring Managers & Technical Recruiters**: Evaluating Mark Raymond Ayade's background, full-stack software development experience, AI-assisted workflow expertise, skills matrix, and project history for employment or contract opportunities.
- **Developers & Tech Enthusiasts**: Engaging with the interactive technical quiz and mini-games (Chain Reaction and the Colony Defense prototype), testing CS domain knowledge, and competing on the global Supabase leaderboard.

## Product Purpose
A modern, single-page professional developer portfolio combined with an interactive technical quiz hub and mini-games. It showcases Mark Raymond Ayade's full-stack capabilities while engaging visitors through interactive CS quizzes across 12 specialized categories with live leaderboard tracking.

## Positioning
Combines a professional software developer portfolio with live, interactive mini-games and a Supabase-backed competitive quiz engine, showcasing both production engineering capability and creative frontend/full-stack execution.

## Operating Context
- Visitors access via web browsers on desktop and mobile (`https://super-momon.github.io`).
- Recruiters review resume details, interactive experience timelines (Talleco.com Inc. / JobTarget PH), and project showcases.
- Players select quiz categories, game modes (Survival, Lives, Marathon), answer timed questions, and submit high scores to a global leaderboard.

## Capabilities and Constraints
- **Framework**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`).
- **Database & Backend**: Supabase JS Client SDK for persistent leaderboard storage (`leaderboard` table) and a session-scoped portfolio visitor counter (`admin_keys` table through restricted RPC functions).
- **Core Sections**: Hero, About, Experience Timeline, Project Showcase, Skills Matrix, Education, Contact Form, and mini-games (`/games/quiz`, `/games/chain-reaction`, `/games/colony-defense` prototype).
- **Deployment & Domain**: GitHub Pages hosting at `https://super-momon.github.io`.

## Brand Commitments
- **Owner**: Mark Raymond M. Ayade (`super-momon`).
- **Title**: Full Stack Developer specializing in AI-assisted development.
- **Identity**: Dark-themed, glassmorphic modern UI with subtle micro-animations and responsive layouts.

## Evidence on Hand
- Full portfolio section components located in `src/components/sections/` (`Hero.tsx`, `About.tsx`, `Experience.tsx`, `Projects.tsx`, `Skills.tsx`, `Education.tsx`, `Contact.tsx`).
- Quiz question bank JSON files in `src/data/quiz/` spanning 12 CS/dev categories.
- Supabase integration modules in `src/lib/supabase.ts`, `src/lib/leaderboard.ts`, and `src/lib/portfolioVisitor.ts`.
- A floating portfolio visitor CTA that displays the aggregate count and permits one acknowledgment per browser tab session.
- Navigation and information constants in `src/lib/constants.ts`.

## Product Principles
1. **Dual Value**: Balance professional credibility for hiring managers with interactive engagement for tech visitors.
2. **Performance & Fluidity**: Maintain smooth animations, fast load times, and responsive layouts across desktop and mobile.
3. **Data Integrity & Interactivity**: Provide real-time interactive UI feedback, precise quiz timing, and dependable Supabase backend operations.
