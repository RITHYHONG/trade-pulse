/**
 * @trade-pulse/config
 * Shared runtime-safe configuration constants for the Trade Pulse platform.
 * Keep this free of environment-variable reads so it works in any context.
 */

// ─── App metadata ─────────────────────────────────────────────────────────────

export const APP_NAME = "Trade Pulse" as const;
export const APP_VERSION = "0.1.0" as const;

// ─── API endpoints (relative — callers resolve the base URL) ──────────────────

export const API_ROUTES = {
  auth: {
    setCookies: "/api/auth/set-cookies",
    clearCookies: "/api/auth/clear-cookies",
  },
  blog: {
    posts: "/api/blog/posts",
    post: (id: string) => `/api/blog/posts/${id}`,
  },
  cron: {
    generateBlog: "/api/cron/generate-blog",
  },
} as const;

// ─── Feature flags ────────────────────────────────────────────────────────────

export const FEATURE_FLAGS = {
  aiChatbot: true,
  blogCreation: true,
  payments: false,           // Stripe — enable when ready
  microserviceAuth: false,   // api-auth service — enable when deployed
} as const;

// ─── Pagination defaults ──────────────────────────────────────────────────────

export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const;
