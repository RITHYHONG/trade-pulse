# Trade Pulse — Project Structure

> **Stack**: Next.js 15 · React 19 · TypeScript · Tailwind CSS · Firebase · Zustand · Turbopack  
> **Monorepo**: Turborepo with pnpm workspaces

---

## Root Layout

```
trade-pulse/
├── apps/
│   └── web/                   # Main Next.js application
├── packages/
│   ├── config/                # Shared config (ESLint, Tailwind, etc.)
│   ├── types/                 # Shared TypeScript types
│   └── ui/                    # Shared UI primitives
├── functions/                 # Firebase Cloud Functions
│   └── src/
│       └── index.ts
├── turbo.json                 # Turborepo pipeline config
├── pnpm-workspace.yaml        # Workspace definition
└── package.json               # Root scripts
```

---

## apps/web — Next.js Application

```
apps/web/
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/            # React components
│   ├── config/                # App-level config
│   ├── data/                  # Static data / mock data
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Service functions & utilities
│   ├── services/              # External API services
│   ├── store/                 # Zustand state stores
│   ├── styles/                # Global styles / CSS modules
│   ├── types/                 # Local TypeScript types
│   ├── utils/                 # Helper utilities
│   └── middleware.ts          # Route protection middleware
│
├── config/                    # SEO, ads, site metadata
│   ├── seo.ts
│   ├── site.ts
│   └── ads.ts
│
├── content/
│   ├── config.ts
│   └── posts/                 # MDX blog posts
│
├── prisma/
│   ├── schema.prisma          # Prisma schema (User model)
│   └── seed.ts
│
├── public/
│   ├── icons/
│   ├── images/
│   ├── robots.txt
│   └── index.html
│
├── scripts/                   # Automation & utility scripts
│   ├── add-post-views.ts
│   ├── automation.ts
│   ├── backup-db.ts
│   ├── fix-storage-cors.ps1
│   ├── fix-storage-cors.sh
│   ├── generate-ai-summary.ts
│   ├── local-cron.js
│   └── update-market-data.ts
│
├── tests/                     # Test suite
├── docs/                      # Feature documentation
├── AGENTS/                    # AI agent prompts
├── next.config.ts
├── tailwind.config.js
├── tsconfig.json
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
└── vercel.json
```

---

## src/app — Pages & API Routes

### Pages (App Router)

```
app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Home page
├── globals.css
│
├── (auth)/                    # Auth route group
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   ├── reset-password/
│   └── components/            # Shared auth UI
│
├── (marketing)/               # Marketing route group
│   ├── about/
│   ├── features/
│   ├── pricing/
│   ├── contact/
│   └── components/
│
├── blog/                      # Blog listing & detail
│   ├── page.tsx
│   ├── [slug]/                # Dynamic post page
│   ├── rss.xml/               # RSS feed route
│   └── figma/                 # Figma design references
│
├── dashboard/                 # Protected dashboard
│   ├── page.tsx
│   ├── @modal/                # Parallel route (modals)
│   ├── app/                   # Nested app shell
│   │   ├── alerts/
│   │   ├── settings/
│   │   ├── upgrade/
│   │   └── watchlist/[symbol]/
│   ├── alerts/
│   ├── settings/
│   ├── upgrade/
│   └── watchlist/
│
├── calendar/                  # Economic calendar
│   ├── page.tsx
│   ├── components/
│   │   └── economic-calendar/
│   ├── hooks/
│   ├── styles/
│   └── guidelines/
│
├── create-post/               # Blog post editor (admin)
│   └── styles/
│
├── settings/
├── contact/
├── welcome/
├── privacy/
├── terms/
├── disclaimer/
├── cookie-policy/
└── cookies/
```

### API Routes

```
app/api/
├── auth/
│   ├── [...nextauth]/         # NextAuth handler
│   ├── set-cookies/           # Set auth-token cookie
│   ├── clear-cookies/         # Clear auth-token cookie
│   └── validate/              # Token validation
│
├── market/
│   ├── all-data/              # Bulk market data
│   └── ticker-sentiment/      # Sentiment by ticker
│
├── dashboard/
│   ├── ai-summary/            # AI market summary
│   ├── bulk-data/             # Batched dashboard data
│   ├── calendar/              # Calendar events
│   ├── news/                  # News feed
│   └── sentiment/             # Market sentiment
│
├── blog/
│   ├── view/                  # Increment view count
│   ├── views/                 # Get view counts
│   └── co-author/             # AI co-author endpoint
│
├── calendar/
│   ├── events/
│   ├── bulk/
│   ├── correlations/
│   └── intelligence/
│
├── admin/                     # Admin-only endpoints
├── contact/
│   └── concierge/
├── newsletter/
│   └── subscribe/
├── user/
│   └── profile/
├── health/
│   └── gemini/
├── cron/
│   └── generate-blog/
└── webhooks/
    ├── stripe/
    └── tradingview/
```

---

## src/components — UI Components

```
components/
├── ui/                        # Shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── table.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── sidebar.tsx
│   ├── chart.tsx
│   ├── skeleton.tsx
│   ├── toast / sonner.tsx
│   └── ... (30+ primitives)
│
├── dashboard/
│   ├── layout/                # Dashboard shell & chrome
│   └── widgets/               # Draggable dashboard widgets
│       ├── widget-grid.tsx    # DnD kit grid
│       └── widget-settings.tsx
│
├── blog/
│   ├── blog-card.tsx
│   ├── featured-posts.tsx
│   └── share-buttons.tsx
│
├── ai/
│   ├── ai-summary.tsx
│   └── chatbot.tsx
│
├── marketing/
│   ├── hero-section.tsx
│   ├── features-grid.tsx
│   └── pricing-cards.tsx
│
├── navigation/
│   ├── HeaderMain.tsx
│   ├── footer.tsx
│   └── mobile-nav.tsx
│
├── editor/
│   └── RichTextEditor.tsx
│
├── providers/
│   ├── auth-provider.tsx
│   ├── theme-provider.tsx
│   ├── query-provider.tsx
│   └── session-manager.tsx
│
├── ads/
│   ├── adsense-wrapper.tsx
│   ├── inline-ad.tsx
│   └── sidebar-ad.tsx
│
└── figma/                     # Figma design system references
```

---

## src/lib — Core Services & Utilities

```
lib/
├── firebase.ts                # Firebase client SDK init
├── firebase-admin.ts          # Firebase Admin SDK
├── auth.ts                    # NextAuth config
├── google-auth.ts             # Google OAuth helpers
├── blog-firestore-service.ts  # Blog CRUD (Firestore)
├── blog-service.ts            # Blog helpers
├── blog-admin-service.ts      # Admin blog operations
├── firestore-service.ts       # Generic Firestore helpers
├── ai-service.ts              # Gemini / DeepSeek AI
├── gemini.ts                  # Google Gemini client
├── deepseek.ts                # DeepSeek AI client
├── market-data.ts             # Market data fetchers
├── market-data-service.ts     # Market data service layer
├── news-api.ts                # News API integration
├── stripe.ts                  # Stripe payments
├── contact-service.ts         # Contact form service
├── search-service.ts          # Search functionality
├── content-generator.ts       # AI content generation
├── user-role-helper.ts        # Role/permission helpers
├── validations.ts             # Zod validation schemas
├── utils.ts                   # General utilities (cn, etc.)
├── formatters.ts              # Number/date formatters
├── constants.ts               # App-wide constants
├── error.ts                   # Error handling
├── retry.ts                   # Retry logic
├── toast.ts                   # Toast helpers
├── seo.ts                     # SEO utilities
├── database.ts                # DB abstraction
├── client.ts                  # API client
├── temp-image-upload.ts       # Temporary image upload
└── api/                       # API helper utilities
    └── services/
```

---

## src/store — Zustand State

```
store/
├── index.ts                   # Store exports
├── auth-store.ts              # Auth state (user, session)
├── dashboard-store.ts         # Dashboard layout & widgets
└── ui-store.ts                # Global UI state (modals, theme)
```

---

## src/hooks — Custom React Hooks

```
hooks/
├── use-auth.ts                # Authentication hook
├── use-dashboard.ts           # Dashboard data hook
├── use-widgets.ts             # Widget management
├── use-author-profile.ts      # Author profile data
├── use-view-count.ts          # Blog view tracking
├── use-local-storage.ts       # Local storage sync
├── use-media-query.ts         # Responsive breakpoints
├── useFormErrorToasts.ts      # Form error display
└── usePrefersReducedMotion.ts # Accessibility motion
```

---

## src/services — External Service Integrations

```
services/
└── economic-calendar.service.ts   # Economic calendar API
```

---

## packages/ — Shared Packages

```
packages/
├── config/
│   └── src/index.ts           # Shared ESLint / TS config
│
├── types/
│   └── src/index.ts           # Shared TypeScript interfaces
│
└── ui/
    └── src/index.ts           # Shared UI primitives
```

---

## Key Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js + Turbopack config |
| `tailwind.config.js` | Tailwind theme + custom tokens |
| `tsconfig.json` | TypeScript path aliases (`@/`) |
| `firebase.json` | Firebase hosting & functions |
| `firestore.rules` | Firestore security rules |
| `firestore.indexes.json` | Composite index definitions |
| `storage.rules` | Firebase Storage security rules |
| `vercel.json` | Vercel deployment config |
| `apphosting.yaml` | Firebase App Hosting config |
| `prisma/schema.prisma` | Prisma schema (User model) |

---

## Environment Variables

| Prefix | Used For |
|--------|---------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client config |
| `FIREBASE_ADMIN_*` | Firebase Admin SDK (server-only) |
| `NEXTAUTH_*` | NextAuth secret & URL |
| `GOOGLE_*` | Google OAuth credentials |
| `STRIPE_*` | Stripe API keys |
| `GEMINI_API_KEY` | Google Gemini AI |
| `ALPHA_VANTAGE_*` | Market data API |
| `NEWS_API_KEY` | News API |

---

## Data Flow

```
User Request
     │
     ▼
middleware.ts  ──► checks auth-token cookie ──► redirect if unauth
     │
     ▼
Next.js App Router Page
     │
     ├── Client Component ──► Zustand Store ──► Firestore (via lib/)
     │
     └── Server Component / API Route
              │
              ├── Firebase Admin SDK (Firestore / Auth)
              ├── Gemini AI (ai-service.ts)
              ├── Market Data APIs
              └── Stripe (stripe.ts)
```

---

## Auth Flow

```
1. User signs in via Google OAuth (NextAuth)
2. Firebase Auth creates/updates user record
3. /api/auth/set-cookies sets auth-token cookie
4. middleware.ts validates cookie on protected routes
5. User profile stored in Firestore `users` collection
6. Role ('user' | 'admin') checked via user-role-helper.ts
```

---

## Blog System

```
Firestore `posts` collection
├── id, title, slug, excerpt
├── blocks[]          ← structured content blocks
├── featuredImage     ← Firebase Storage URL
├── author { uid, name, photoURL }
├── tags[], category
├── status ('draft' | 'published')
├── viewCount, createdAt, updatedAt
└── coAuthors[]       ← AI co-author support

Image Upload Flow:
  data URL → File → Firebase Storage (blog-images/) → URL saved to post
```

---

## Dashboard Widgets

Widgets are draggable via `@dnd-kit`. Layout is persisted in Zustand and synced to Firestore per user.

| Widget | Description |
|--------|-------------|
| Market Overview | Live price tickers |
| AI Summary | Gemini-powered market brief |
| News Feed | Live financial news |
| Watchlist | Tracked symbols |
| Sentiment | Ticker sentiment scores |
| Calendar | Upcoming economic events |
| Risk Calculator | Position sizing tool |
| Technical Levels | Support / resistance levels |
