# Magic Link Implementation — Summary

Date: 2026-04-02

This document summarizes the magic-link sign-in work I implemented, the files changed/added, the runtime flow, security/hardening details (including rate-limiting), and recommended next steps.

## Overview
I implemented a complete, secure magic-link sign-in flow for Trade Pulse with server-side verification and cluster-safe rate limiting (in-memory by default, with optional Redis integration). The client completes the Firebase email-link sign-in, then the server verifies the ID token and sets secure session cookies.

Goals:
- Enable passwordless sign-in (magic link) with a safe server-side verification step.
- Preserve existing secure cookie/session flow.
- Add device-agnostic fallback when the user opens the link on a different device.
- Harden the verification endpoint with rate-limiting and recommend Redis for cluster-wide limits.

## Files Added / Modified
- apps/web/src/lib/auth.ts
  - Added `sendMagicLink(email)` to send Firebase email sign-in links.
  - Added `completeMagicSignIn(email?)` to complete sign-in with an email link.

- apps/web/src/hooks/use-auth.ts
  - Exposed `sendMagicLink` through the `useAuth` hook.

- apps/web/src/store/auth-store.ts
  - Added `sendMagicLink` action so UI can trigger magic links via the store.

- apps/web/src/app/(auth)/components/LoginForm.tsx
  - UI: added "Use magic link" toggle and inline magic-link send button.
  - Accessibility: autofocus, autocomplete, aria-invalid/aria-describedby on inputs.
  - Added a demo button (placeholder) for fast onboarding.

- apps/web/src/app/(auth)/components/SignUpForm.tsx
  - Accessibility and autocomplete improvements (name/email/password attributes, aria labels).

- apps/web/src/app/(auth)/forgot-password/page.tsx
  - Wired to `useAuth.resetPassword` and added autofocus/aria on the email input.

- apps/web/src/app/(auth)/layout.tsx
  - Optimized hero `Image` with `sizes` and `loading="lazy"` to reduce LCP impact on mobile.

- apps/web/src/app/magic-link/page.tsx
  - New client landing page that completes client-side sign-in using `completeMagicSignIn`.
  - Posts the ID token to a new server endpoint (`/api/auth/magic-verify`) for server-side verification and cookie creation.
  - Added fallback form that prompts for the email when the user opens the link on a different device (device-agnostic flow).

- apps/web/src/app/api/auth/magic-verify/route.ts
  - New server endpoint that verifies the Firebase ID token via the Admin SDK and creates session cookies using `admin.auth().createSessionCookie()`.
  - Includes a simple in-memory rate limiter by IP and by email (configurable limits).
  - Falls back to a safe non-Admin behavior when Admin SDK is not initialized (preserves earlier behavior in development).

- apps/web/src/app/api/auth/set-cookies/route.ts
  - Existing endpoint used for sign-in/sign-up flows; left intact and referenced.

## Runtime Flow (high-level)
1. User requests magic link from sign-in UI (LoginForm) → `sendMagicLink(email)` (client-side) which calls Firebase `sendSignInLinkToEmail`.
2. Firebase sends sign-in link to user's email. The link contains an oobCode and redirects to `/magic-link`.
3. User clicks link (same device): `/magic-link` calls `completeMagicSignIn()` which uses `signInWithEmailLink` to finish sign-in client-side and obtains an ID token.
4. Client posts the ID token to `/api/auth/magic-verify`.
5. Server verifies ID token via Firebase Admin SDK, creates a session cookie, sets secure HTTP-only cookie(s), and optionally non-httpOnly user info cookies for client usage.
6. Client is redirected to the dashboard (or `redirect` param if present).

Fallback (different device):
- If the landing page does not find the original email in localStorage, it prompts the user to enter the email used to request the link. The user enters email → client calls `completeMagicSignIn(email)` and proceeds with server verification as above.

## Rate-limiting and Abuse Mitigation
- Implemented in-memory rate limiting on `/api/auth/magic-verify` (per-IP and per-email):
  - IP limit: 10 attempts per hour.
  - Email limit: 5 attempts per hour.
  - On limit hit: returns HTTP 429 with `Retry-After` header.
- Implementation details:
  - Uses global `Map` objects to persist counters during a warm server instance.
  - Prunes old timestamps to maintain sliding window behavior.
  - Lightweight and avoids additional dependencies.

Limitations and production recommendation:
- In-memory limits are process-local and do not provide global limits in multi-instance deployments.
- For production-grade cluster-wide limits, use a shared datastore (Redis/Upstash). I can wire Redis if you provide connection info (I planned a Redis implementation using `INCR`+`EXPIRE` or a leaky-bucket algorithm).

## Security considerations
- Server-side verification ensures the server verifies ID tokens and issues session cookies via the Admin SDK.
- Session cookies are set as `httpOnly`, `secure` (in production), and `sameSite: strict` where appropriate.
- For development environments where Admin SDK is not available, a safe fallback decodes the JWT payload without verification — this is explicitly logged and should not be used in production.
- Consider enabling additional safeguards:
  - Requiring shortened expiry for magic links.
  - Logging and alerting for repeated rate-limit triggers.
  - Blocking abusive IPs and using CAPTCHA for high-risk patterns.

## Next steps (optional, recommended)
- Wire cluster-wide rate limiting using Redis / Upstash (I can implement this if you provide connection credentials):
  - Replace in-memory counters with Redis keys such as `rl:ip:<ip>` and `rl:email:<email>` using `INCR` and `EXPIRE`.
- Add server-only completion path (server consumes the oobCode via Firebase REST API) to avoid relying on client-side `signInWithEmailLink` when desired.
- Add telemetry/alerting for blocked events.
- Polish UX: show an obfuscated email hint in the fallback form when server can return it, and provide clearer copy for traders (e.g., link expiration time, device instructions).

## Where to look in the code
- Login + Signup + Forgot flows: `apps/web/src/app/(auth)/components/*`
- Client helpers: `apps/web/src/lib/auth.ts`
- Client hook/store: `apps/web/src/hooks/use-auth.ts`, `apps/web/src/store/auth-store.ts`
- Magic-link landing: `apps/web/src/app/magic-link/page.tsx`
- Server verification endpoint: `apps/web/src/app/api/auth/magic-verify/route.ts`
- Cookie setter (existing): `apps/web/src/app/api/auth/set-cookies/route.ts`

---
If you want, I can now:
- (A) Wire Redis/Upstash for cluster-wide rate limiting (need connection info), or
- (B) Implement a server-only magic-link completion that consumes the oobCode on the server (requires server to access Firebase REST API), or
- (C) Add logging/alerting and an admin dashboard for blocked attempts.

Tell me which next step you'd like and I will implement it.
