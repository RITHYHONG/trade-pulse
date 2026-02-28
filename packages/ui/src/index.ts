/**
 * @trade-pulse/ui
 * Shared UI primitives for the Trade Pulse platform.
 *
 * At this stage the barrel re-exports the design tokens and any
 * framework-agnostic helpers.  Move shadcn/ui components here
 * once they need to be shared across multiple apps.
 */

// ─── Design tokens ────────────────────────────────────────────────────────────

export const colors = {
  primary: {
    DEFAULT: "hsl(217, 91%, 60%)",   // blue-500
    foreground: "hsl(0, 0%, 100%)",
  },
  accent: {
    DEFAULT: "hsl(158, 64%, 52%)",   // emerald-400
    foreground: "hsl(0, 0%, 100%)",
  },
  neutral: {
    DEFAULT: "hsl(215, 28%, 17%)",   // slate-800
    foreground: "hsl(215, 20%, 65%)",
  },
  success: "hsl(142, 71%, 45%)",
  warning: "hsl(38,  92%, 50%)",
  background: {
    light: "hsl(0, 0%, 100%)",
    dark:  "hsl(222, 47%, 7%)",      // slate-950
  },
} as const;

// ─── Typography scale ─────────────────────────────────────────────────────────

export const typography = {
  fontSans:    "var(--font-sans)",
  fontDisplay: "var(--font-display)",
  scale: {
    xs:   "0.75rem",
    sm:   "0.875rem",
    base: "1rem",
    lg:   "1.125rem",
    xl:   "1.25rem",
    "2xl":"1.5rem",
    "3xl":"1.875rem",
    "4xl":"2.25rem",
    "5xl":"3rem",
  },
} as const;

// ─── Spacing system (8-point grid) ────────────────────────────────────────────

export const spacing = {
  unit: 8,
  px: (n: number) => `${n * 8}px` as const,
} as const;

// ─── Re-export utility helpers ────────────────────────────────────────────────

export { cn } from "./utils";
