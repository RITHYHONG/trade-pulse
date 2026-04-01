---
name: calendar-responsive
version: 0.1
summary: "Make the Calendar page mobile & tablet responsive; actionable checklist and file-level tasks."
---

# Calendar Responsive Skill

Purpose
- Provide a focused, repeatable workflow to make the TradePulse Calendar page (Apps/web) behave correctly on mobile and tablet breakpoints.

Scope
- Workspace-scoped. Place under `AGENTS/frontend-uxui/calendar-responsive/` for team visibility.

When to use
- When a developer needs a clear list of UI changes, files to edit, and acceptance tests for mobile/tablet responsive fixes on the Calendar page.

Primary Outputs
- A short implementation checklist with exact file edits and Tailwind class changes.
- Acceptance criteria and manual test steps for mobile/tablet.

Workflow (step-by-step)
1. Audit layout: inspect `apps/web/src/app/calendar/App.tsx` and the child components under `components/economic-calendar/` for width, padding, and breakpoint usage.
2. Make the FilterSidebar behave as a sheet/drawer on mobile & tablet: ensure `w-72` default, convert to `sm:w-80 md:w-72` as needed, and keep the existing `fixed inset-0 w-full` when `isMobile`.
3. Ensure the Intelligence panel becomes a sheet on <=lg and collapsible at tablet widths; use `Sheet` already present and add `md:hidden` triggers where appropriate.
4. Ensure main views (`TimelineView`, `HeatMapView`, `ListView`) are scrollable horizontally when required and stack vertically at small widths. Add `min-w-0` and `overflow-auto` helpers, and ensure inner elements use responsive grid classes (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) where applicable.
5. Make the EventIntelligencePanel modal full-screen on small viewports (`fixed inset-0 p-4`) and use `max-w-none sm:max-w-lg` to limit on larger screens.
6. Adjust card paddings, gaps and font sizes at `sm`/`md` breakpoints to avoid overflow (use `sm:p-4 md:p-6`, `text-sm`, `text-xs`).
7. Validate touch targets (>=44px) for interactive buttons; add `h-9 w-9` for icon buttons on touch devices.

Files to change (suggested order)
- `apps/web/src/app/calendar/App.tsx` — layout responsive toggles, sidebar/sheet behavior and widths.
- `apps/web/src/app/calendar/components/economic-calendar/FilterSidebar.tsx` — ensure scroll area full height and sheet-compatible header.
- `apps/web/src/app/calendar/components/economic-calendar/TimelineView.tsx` — stack event cards on small screens and ensure timeline axis is responsive.
- `apps/web/src/app/calendar/components/economic-calendar/HeatMapView.tsx` — collapse columns to horizontal scroll and make hour headers compact on small screens.
- `apps/web/src/app/calendar/components/economic-calendar/ListView.tsx` — make table responsive: collapse to cards at `sm` breakpoint or allow horizontal scroll with `min-w-[700px]`.
- `apps/web/src/app/calendar/components/economic-calendar/EventIntelligencePanel.tsx` — responsive modal sizing and focus traps for mobile.

Acceptance criteria
- Calendar header, filters and main content are legible without horizontal scroll on typical mobile widths (360–430px) and tablet (768–1024px).
- Sidebar is hidden by default on mobile and accessible via the filter button; opening the sidebar uses a full-height sheet/drawer.
- Intelligence panel opens as a full-screen overlay on mobile and as a right-side panel on desktop.
- Main views do not overflow the viewport; if content requires more space, horizontal scroll is available and cards stack vertically.

Manual test steps
1. Desktop (≥1280px): open Calendar, confirm sidebar and intelligence panel show as columns and page layout matches previous desktop UX.
2. Tablet (~768–1024px): confirm sidebar is collapsible; main content uses multi-column layout where helpful and cards are readable.
3. Mobile (≤480px): confirm filter button opens a full-screen sheet with filters; intelligence opens as a sheet; event detail panel displays full-screen with close button.
4. Accessibility: tab through the sheet/panel controls; ensure `Escape` closes panels; verify touch targets are large enough.

Notes
- This skill documents the required changes and is a single-source checklist for an implementation PR. If you want, I can apply the edits directly and run quick sanity checks.
