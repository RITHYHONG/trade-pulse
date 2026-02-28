/**
 * @trade-pulse/types
 * Shared TypeScript types for the Trade Pulse platform.
 * Add shared types here as the monorepo grows.
 */

// ─── API Primitives ───────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
}

// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPostMeta {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  authorId: string;
  authorName: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  viewCount: number;
  published: boolean;
}

// ─── Market / Finance ─────────────────────────────────────────────────────────

export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}
