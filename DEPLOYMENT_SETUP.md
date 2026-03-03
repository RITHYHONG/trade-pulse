# 🚀 Deployment Setup Guide

This project deploys automatically to **Vercel** via GitHub Actions.

---

## Quick Overview

| Trigger | Workflow | Action |
|---|---|---|
| Push to `main` | `deploy-production.yml` | Deploy to Vercel production + Firebase rules |
| Pull Request | `deploy-preview.yml` | Vercel preview URL commented on PR |
| Push / PR | `ci.yml` | Lint, type-check, tests |
| Daily 8am UTC | `blog-cron-trigger.yml` | Auto-generate blog posts |

---

## Step 1 — Connect Repo to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import this GitHub repository
3. Set **Root Directory** to `apps/web`
4. Vercel auto-detects Next.js; the `vercel.json` provides the build command

---

## Step 2 — Add Environment Variables in Vercel

In **Vercel Dashboard → Project → Settings → Environment Variables**, add:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_GEMINI_API_KEY
NEXT_PUBLIC_FMP_API_KEY
NEXT_PUBLIC_FINNHUB_API_KEY
NEXTAUTH_SECRET          (generate: openssl rand -base64 32)
DATABASE_URL
CRON_SECRET              (any random string, used to auth cron endpoint)
```

Set each variable for **Production**, **Preview**, and **Development** as appropriate.

---

## Step 3 — Add GitHub Repository Secrets

Go to **GitHub → Repo → Settings → Secrets and variables → Actions** and add:

### Required for Vercel deployment

| Secret | How to get it |
|---|---|
| `VERCEL_TOKEN` | vercel.com → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | vercel.com → Settings → General → Team ID (or your username ID) |
| `VERCEL_PROJECT_ID` | In Vercel project → Settings → General → Project ID |

### Required for Firebase rules deploy

| Secret | How to get it |
|---|---|
| `FIREBASE_TOKEN` | Run `firebase login:ci` locally and copy the token |

### Required for blog cron

| Secret | How to get it |
|---|---|
| `APP_DOMAIN` | Your Vercel domain, e.g. `trade-pulse.vercel.app` (no `https://`) |
| `CRON_SECRET` | Same value you added to Vercel env vars above |

---

## Step 4 — Get Vercel IDs

```bash
# From the apps/web directory, after logging in with `vercel login`:
cd apps/web
vercel link     # Follow prompts — creates .vercel/project.json
cat .vercel/project.json
# { "orgId": "YOUR_ORG_ID", "projectId": "YOUR_PROJECT_ID" }
```

Copy `orgId` → `VERCEL_ORG_ID` secret  
Copy `projectId` → `VERCEL_PROJECT_ID` secret

---

## Step 5 — Get Firebase CI Token

```bash
npx firebase login:ci
# Copy the token printed to the terminal → FIREBASE_TOKEN secret
```

---

## Step 6 — Protect the Cron Endpoint

In `src/app/api/cron/generate-blog/route.ts`, verify the `CRON_SECRET`:

```ts
export async function GET(request: Request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ... blog generation logic
}
```

Vercel's native cron (from `vercel.json`) calls this automatically — no secret needed for Vercel's own calls. The secret is only used by the GitHub Actions cron workflow.

---

## Workflow Summary

```
main branch push
  └── ci.yml             ← lint, type-check, tests
  └── deploy-production.yml
        ├── Vercel build + production deploy
        └── Firebase: firestore rules, indexes, storage rules

pull_request → main
  └── ci.yml             ← lint, type-check, tests
  └── deploy-preview.yml ← Vercel preview URL posted to PR

daily (8am UTC)
  └── blog-cron-trigger.yml ← calls /api/cron/generate-blog
```

---

## Local Development

```bash
pnpm install
cd apps/web
cp .env.example .env.local  # fill in your values
pnpm dev
```
