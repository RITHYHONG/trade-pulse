# AI Coding Agent Instructions for Trade Pulse

## Project Overview
Trade Pulse is a Next.js 15 financial trading platform with Firebase backend, featuring real-time market data, AI-powered analysis, blog content management, and user authentication. The app uses Firestore for data persistence, Firebase Storage for media, and NextAuth with Google OAuth.

## Architecture
- **Frontend**: Next.js App Router with React 19, TypeScript, Tailwind CSS, Shadcn/ui components
- **Backend**: Firebase (Auth, Firestore, Storage), Next.js API routes for custom logic
- **State Management**: Zustand stores (auth, dashboard, UI)
- **Styling**: Tailwind CSS with custom animations, dark theme (slate-950/slate-100)
- **Key Directories**:
  - `src/app/`: App router pages and API routes
  - `src/components/`: Feature-organized components (ai/, blog/, dashboard/, ui/)
  - `src/lib/`: Services (firebase.ts, blog-firestore-service.ts, auth.ts)
  - `prisma/`: Database schema (minimal, User model only)
  - `content/posts/`: MDX blog posts
  - `config/`: Site and SEO configuration

## Critical Workflows
- **Development**: `npm run dev` (uses Turbopack for fast builds)
- **Build**: `npm run build` (Turbopack enabled)
- **Firebase Deploy**: `npm run deploy:indexes` for Firestore index updates
- **Auth Flow**: Cookies managed via `/api/auth/set-cookies` and `/api/auth/clear-cookies`
- **Middleware Protection**: Routes like `/dashboard`, `/create-post` require auth-token cookie

## Key Patterns
- **Blog System**: Posts stored in Firestore `posts` collection with structured blocks array. Images uploaded to Firebase Storage under `blog-images/`. Public read, authenticated write with author validation.
- **Authentication**: Firebase Auth with NextAuth. User profiles in Firestore `users` collection. Roles ('user'/'admin') stored in profiles.
- **Data Fetching**: Direct Firestore queries in service functions (e.g., `getBlogPost`, `createBlogPost` in `blog-firestore-service.ts`)
- **Error Handling**: Use Sonner toasts for user feedback, console logs for debugging
- **File Uploads**: Convert data URLs to Files, upload to Storage, store URLs in Firestore
- **Validation**: Zod schemas in `src/lib/validations.ts` for form data

## Integration Points
- **Firebase Config**: Environment variables prefixed `NEXT_PUBLIC_FIREBASE_`
- **Storage CORS**: Requires setup via `scripts/fix-storage-cors.ps1` or manual config
- **Firestore Rules**: Public read for posts/users, authenticated write with ownership checks
- **AI Features**: Standalone HTML pages (e.g., `chatbot.tsx` as HTML) for Gemini integration

## Examples
- **Creating Blog Post**: Use `createBlogPost()` from `blog-firestore-service.ts`, upload image first, then save post with `featuredImage` URL
- **Auth Check**: In components, use `useAuth` hook or check `auth-token` cookie
- **Widget Grid**: Dashboard uses `@dnd-kit` for draggable widgets, stored in Zustand
- **SEO**: Meta tags configured in `config/seo.ts`, applied via `defaultMetadata`

## Conventions
- Component imports: Use `@/` aliases (e.g., `@/lib/firebase`)
- File naming: kebab-case for pages, PascalCase for components
- State: Prefer Zustand over local state for shared data
- API routes: RESTful structure under `src/app/api/`
- Environment: Separate public/private vars, public ones prefixed `NEXT_PUBLIC_`</content>
<parameter name="filePath">c:\Users\Tk custom\trade-pulse\.github\copilot-instructions.md


Visual System: Propose a 6‑color palette (primary, accent, neutral, success, warning, background) for light/dark modes; add token values and Tailwind variables.
Typography: Pair a clean sans (for UI) with an expressive display; provide scale, weights, and line-height for headings, body, captions.
Layout & Spacing: Use a 4‑ or 8‑point spacing system; define container widths and grid rules for cards and dashboard widgets.
Interactions: Define hover/focus states, micro-animations (subtle), and accessible motion settings.
Accessibility: 4.5:1 text contrast minimum, keyboard focus states, large hit targets on mobile.
Deliverables: Style guide (tokens + Tailwind mapping), high-fidelity Figma screens (desktop & mobile) for Home, Blog post, Dashboard + component spec for HeaderMain, post cards, and widget cards.