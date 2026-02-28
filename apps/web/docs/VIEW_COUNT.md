# Post View Count Implementation

This document explains the view count feature and how to manage it.

## Overview
- `views` is a numeric field on `posts` documents in Firestore.
- Writes to `views` are performed server-side using the Firebase Admin SDK via the Next.js API route: `POST /api/blog/views`.
- Clients call the API via `src/hooks/use-view-count.ts` which enforces a local TTL (default 1 hour) to minimize duplicate counts.

## Migration
1. Install new dependencies and ensure your environment is up-to-date: `yarn` (or `npm install`).
2. Set service account env vars: `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`.
3. Run the migration script to initialize existing posts: `pnpm migrate:add-post-views` (or `yarn migrate:add-post-views`, `npm run migrate:add-post-views`).

## Environment
- Make sure to provide Firebase admin credentials in environment variables for server-side code.

## Privacy
- The client hook supports a `requireConsent` option. If you want views to be counted only when users consent to analytics, pass `requireConsent: true` or check your consent cookie before calling the hook.

## Extending
- Consider adding server-side dedupe (per-anonId document or Redis) and rate-limiting if you need stronger anti-abuse protections.
- Add daily bucketed counters (`views_daily/{yyyy-mm-dd}`) for analytics aggregation and fast queries.

## Notes
- Firestore security rules remain unchanged: `views` is updated via Admin SDK and does not require changing rules to allow unauthenticated client writes.
