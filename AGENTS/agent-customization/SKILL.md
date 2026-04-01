---
name: agent-customization
version: 1.0
summary: "Create, update, review, or debug VS Code agent customization files and reusable skills for workspace or personal use."
---

# Agent Customization Skill (workspace-friendly)

Purpose
- Provide a concise, repeatable workflow for creating, updating, validating, and iterating on agent customization assets: `.instructions.md`, `.prompt.md`, `.agent.md`, `SKILL.md`, `copilot-instructions.md`, and `AGENTS.md`.

Scope
- Workspace-scoped by default. This skill is suitable for team-shared customizations (place under `AGENTS/` or `.github/`). For personal/user-scoped prompts, use the user's prompts folder (`{{VSCODE_USER_PROMPTS_FOLDER}}`).

When to use
- You have a multi-step workflow or policy to capture (e.g., code-review checklist, repo onboarding, release steps).
- You need a maintainable template for prompts or skills that teammates will reuse.

Primary Outputs
- A `SKILL.md` file containing: purpose, step-by-step workflow, decision points, quality criteria, example prompts, and suggested files/locations to add.

Workflow (step-by-step)
1. Gather context: review the conversation, existing agent files, and repo conventions.
2. Decide scope: workspace vs user; global vs path-limited. (See Decision Points.)
3. Choose primitive: Instruction, Prompt, Agent, Hook, or Skill.
4. Draft frontmatter: `name`, `description`, `version`, `applyTo` (if path-limited).
5. Write the body: clear steps, branching points, acceptance criteria, and minimal examples.
6. Save to the chosen path and validate YAML frontmatter and `description` trigger phrases.
7. Iterate with the user: surface ambiguities, refine examples, and add test prompts.

Decision Points & Branching
- If the workflow is single-step and parameterizable → create a `*.prompt.md`.
- If the workflow is multi-step, stateful, or bundles assets → create a `SKILL.md`.
- If you need tool restrictions or context isolation per stage → prefer a Custom Agent (`*.agent.md`).
- If the customization should only apply to certain files → add `applyTo` globs (avoid `"**"` unless necessary).

Quality Criteria / Completion Checks
- Frontmatter present and valid YAML.
- `description` includes trigger keywords and at least one short summary sentence.
- Steps are actionable, numbered, and have at least one acceptance check (how to know it's done).
- Examples: at least two example prompts or use-cases to validate discovery.
- Saved at the agreed path and easily discoverable by teammates.

Ambiguities to Clarify (ask the user)
- Should this SKILL be workspace-scoped or personal? (affects location)
- Preferred file path and naming convention? (`AGENTS/agent-customization/SKILL.md` suggested)
- Any required frontmatter keys or versioning policy?

Example Prompts to Try
- "Create skill for release checklist that runs unit tests and verifies changelog entries."
- "Validate SKILL frontmatter for `applyTo` globs and return a short checklist of issues."

Suggested Next Skills / Extensions
- `skill:release-checklist` — automate release steps.
- `skill:code-review-checklist` — standardized PR checks.

Template Snippet
---
name: my-skill-name
version: 0.1
description: "Use when: <short trigger phrases>; summary: <one-line>"
applyTo: ["src/**"]
---

Body: Describe steps, branching logic, and acceptance criteria.

----
Created by agent on behalf of the repo to accelerate consistent agent customizations. Replace placeholders and iterate.
