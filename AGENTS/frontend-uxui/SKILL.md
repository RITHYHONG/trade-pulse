---
name: frontend-uxui
version: 1.0
summary: "Workspace skill for UX/UI audits, design-token reviews, component specs, and actionable frontend improvements."
---

# Frontend UX/UI Skill (workspace-scoped)

Purpose
- Provide a repeatable, practical workflow the team and agents use to audit UX, enforce design-token consistency, produce component specs, and generate accessible, production-ready frontend changes.

Scope
- Workspace-scoped. Place under `AGENTS/frontend-uxui/`. Intended to operate on the `apps/web` frontend (Tailwind + CSS variables + React components).

When to use
- Before design or implementation sprints to align styles and tokens.
- When reviewing PRs for visual regressions, accessibility, or interaction quality.
- When scaffold new components or create Figma + spec-ready artifacts.

Primary Outputs
- Audit report (accessibility, contrast, keyboard, focus states, motion accessibility).
- Component spec (props, states, sizes, tokens, ARIA guidance, examples).
- Tailwind/CSS token mapping and suggested token additions.
- Minimal code patches or PR-ready suggestions (class changes, aria fixes, CSS variable additions).

Workflow (step-by-step)
1. Gather context
   - Inspect `apps/web/src/app/globals.css`, `apps/web/tailwind.config.js`, and `apps/web/src/components/ui/*`.
   - Identify existing tokens (e.g., `--primary`, `--background`, `--card`, semantic tokens like `--color-primary`).
2. Run automated checks
   - Contrast: verify text/background pairs meet 4.5:1 for normal text, 3:1 for large text.
   - Keyboard focus: ensure interactive elements have visible focus (`.focus-ring` usage or equivalent).
   - Motion: detect large transforms/animations and confirm accessible toggle exists (`prefers-reduced-motion`).
3. Component audit (prioritize Buttons, Inputs, Cards, Header, Nav, Modal)
   - For each component, produce a spec: API (props), variants, visual states (hover/focus/active/disabled), responsive rules, and accessibility notes.
4. Token harmonization
   - Map token usage to Tailwind classes and CSS variables (list missing semantic tokens and propose names).
   - Propose additions: accent, success/warning/info muted variants, spacing tokens, and container widths.
5. Deliver fixes and recommendations
   - Create minimal code diffs (class swaps, add aria attributes, add focus styles, update token values).
   - Provide visual QA checklist and example Figma screen descriptions (hero, blog post, dashboard) for designers.
6. Iterate with designer/developer
   - Clarify ambiguous colors or behaviors; finalize tokens and bump version in skill.

Decision Points
- If an issue is a cross-cutting token mismatch → propose token change + codemod across `src/components/ui`.
- If a component lacks accessibility props → propose small PR adding `role`, `aria-*`, and keyboard handlers.
- If a design requires new visuals (Figma) → produce a spec and example export-ready assets description, then hand off to designer.

Quality Criteria / Acceptance Checks
- Color contrast: 4.5:1 for body text, 3:1 for large headings.
- Keyboard navigability: all interactive controls reachable and operable with keyboard.
- Focus states: visible and meet contrast/size expectations.
- Touch targets: >=44px minimum interactive hit area on mobile.
- Motion: respectful of `prefers-reduced-motion` and provides accessible alternatives.
- Tokens: no duplicated color values — prefer semantic tokens over hard-coded hex in components.

Example Prompts (for agent or dev)
- "Audit `HeaderMain.tsx` for accessibility and list concrete fixes (aria, keyboard, contrast)."
- "Generate a `Button` component spec with `primary/outline/ghost` variants, sizes, and token mappings to `--primary` and Tailwind classes." 
- "Produce a Tailwind/CSS mapping table from `globals.css` (light/dark) and recommend three new semantic tokens for charts and notifications." 

Suggested Files to Create
- `AGENTS/frontend-uxui/AUDIT-<date>.md` — human-readable audit results.
- `AGENTS/frontend-uxui/COMPONENT-SPECS/` — YAML/MD files per component.
- Optional codemod scripts to rename classes or replace hard-coded colors.

Suggested Next Skills
- `skill:frontend-performance` — audit bundle sizes, hydration, and image loading.
- `skill:design-to-code` — generate Figma-friendly specs and style tokens export.

Notes
- This skill assumes `apps/web/src/app/globals.css` contains design tokens (it does). Use CSS variables as the single source of truth and prefer semantic tokens in components.

----
Replace placeholders and iterate. Use the example prompts to run the first audits and return findings.
