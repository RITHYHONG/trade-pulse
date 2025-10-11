This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

trader-daily-edge/
├── public/
│   ├── icons/
│   │   ├── favicon.ico
│   │   └── app-icon.png
│   ├── images/
│   │   ├── logo.svg
│   │   ├── dashboard-preview.png
│   │   └── team/
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── (marketing)/                   # Marketing pages group
│   │   │   ├── page.tsx                   # Landing page
│   │   │   ├── layout.tsx                 # Marketing layout (footer, header)
│   │   │   ├── features/
│   │   │   │   └── page.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   ├── (auth)/                        # Authentication pages group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   ├── (app)/                         # Main application group
│   │   │   ├── page.tsx                   # Dashboard main page
│   │   │   ├── layout.tsx                 # App layout (sidebar, header)
│   │   │   ├── loading.tsx                # Dashboard loading state
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── watchlist/
│   │   │   │   └── page.tsx
│   │   │   ├── alerts/
│   │   │   │   └── page.tsx
│   │   │   └── upgrade/
│   │   │       └── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx                   # Blog index
│   │   │   ├── loading.tsx
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx               # Individual blog post
│   │   │   │   └── loading.tsx
│   │   │   └── rss.xml/route.ts           # RSS feed
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── route.ts
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── news/route.ts
│   │   │   │   ├── calendar/route.ts
│   │   │   │   ├── sentiment/route.ts
│   │   │   │   └── ai-summary/route.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe/route.ts        # Payment webhooks
│   │   │   │   └── tradingview/route.ts   # Data webhooks
│   │   │   └── admin/
│   │   │       └── route.ts
│   │   ├── welcome/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx                     # Root layout
│   │   ├── page.tsx                       # Redirects to marketing
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   └── disclaimer/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                           # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── table.tsx
│   │   │   └── skeleton.tsx
│   │   ├── marketing/                    # Marketing page components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── features-grid.tsx
│   │   │   └── pricing-cards.tsx
│   │   ├── dashboard/                    # Dashboard specific components
│   │   │   ├── layout/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── header.tsx
│   │   │   │   └── mobile-nav.tsx
│   │   │   ├── widgets/
│   │   │   │   ├── ai-summary.tsx
│   │   │   │   ├── economic-calendar.tsx
│   │   │   │   ├── market-news.tsx
│   │   │   │   ├── market-sentiment.tsx
│   │   │   │   ├── technical-levels.tsx
│   │   │   │   └── watchlist.tsx
│   │   │   ├── widget-grid.tsx
│   │   │   ├── widget-settings.tsx
│   │   │   └── premium-badge.tsx
│   │   ├── blog/
│   │   │   ├── blog-card.tsx
│   │   │   ├── featured-posts.tsx
│   │   │   └── share-buttons.tsx
│   │   ├── ads/
│   │   │   ├── adsense-wrapper.tsx
│   │   │   ├── sidebar-ad.tsx
│   │   │   └── inline-ad.tsx
│   │   └── providers/
│   │       ├── theme-provider.tsx
│   │       ├── auth-provider.tsx
│   │       └── query-provider.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── validations.ts                 # Zod schemas
│   │   ├── api/
│   │   │   ├── client.ts                  # API client configuration
│   │   │   ├── news-api.ts
│   │   │   ├── market-data.ts
│   │   │   ├── ai-service.ts              # AI summary generation
│   │   │   └── economic-calendar.ts
│   │   ├── auth.ts                        # Authentication utilities
│   │   ├── database.ts                    # DB client (Prisma)
│   │   ├── stripe.ts                      # Payment utilities
│   │   ├── seo.ts                         # SEO helpers
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-dashboard.ts
│   │   ├── use-toast.ts
│   │   ├── use-local-storage.ts
│   │   └── use-widgets.ts
│   ├── store/
│   │   ├── index.ts                       # Zustand store
│   │   ├── auth-store.ts
│   │   ├── dashboard-store.ts
│   │   └── ui-store.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── market.ts
│   │   ├── blog.ts
│   │   └── api.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components/
│   │   │   ├── dashboard.css
│   │   │   └── ui.css
│   │   └── utils.css
│   └── middleware.ts                      # Authentication middleware
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── content/                              # MDX blog posts
│   ├── posts/
│   │   ├── pre-market-analysis-2024-01-15.mdx
│   │   └── ...
│   └── config.ts
├── scripts/
│   ├── generate-ai-summary.ts           # Daily AI summary cron job
│   ├── update-market-data.ts
│   └── backup-db.ts
├── config/
│   ├── site.ts                          # Site configuration
│   ├── seo.ts
│   └── ads.ts                           # AdSense configuration
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
