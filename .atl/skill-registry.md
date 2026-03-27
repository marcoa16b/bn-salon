# Skill Registry — bn-marys-salon

Generated: 2026-03-25

## Project Conventions

- No convention files detected (no .cursorrules, AGENTS.md, CLAUDE.md, .claude/)
- Project is vanilla Next.js 16.2.1 with React 19.2.4 + TypeScript
- ESLint: next/core-web-vitals + next/typescript
- Styling: Tailwind CSS v4 (CSS-first config)

---

## Available Skills

### SDD Workflow (Spec-Driven Development)

| Skill | Trigger | Description |
|-------|---------|-------------|
| `sdd-init` | "sdd init", "iniciar sdd", "openspec init" | Initialize SDD context in a project |
| `sdd-explore` | Explore a feature, investigate codebase, clarify requirements | Investigate before committing to a change |
| `sdd-propose` | Create or update a proposal for a change | Intent, scope, approach, risks |
| `sdd-spec` | Write/update specs for a change | Requirements and scenarios (delta specs) |
| `sdd-design` | Create or update technical design | Architecture decisions, data flow, file changes |
| `sdd-tasks` | Break down a change into tasks | Implementation checklist organized by phase |
| `sdd-apply` | Implement tasks from a change | Write actual code following specs and design |
| `sdd-verify` | Verify implementation matches specs | Quality gate with test execution |
| `sdd-archive` | Archive a completed change | Sync delta specs to main, move to archive |

### Specialized Skills

| Skill | Trigger | Description |
|-------|---------|-------------|
| `skill-creator` | Create a new skill, add agent instructions | Document patterns for AI agents |
| `judgment-day` | "judgment day", "dual review", "juzgar" | Parallel adversarial review protocol |
| `go-testing` | Go tests, teatest, Bubbletea TUI testing | Go testing patterns (NOT RELEVANT — no Go stack) |

---

## Skill Locations

All skills are installed at: `~/.config/opencode/skills/`

```
~/.config/opencode/skills/
├── sdd-apply/SKILL.md
├── sdd-archive/SKILL.md
├── sdd-design/SKILL.md
├── sdd-explore/SKILL.md
├── sdd-init/SKILL.md
├── sdd-propose/SKILL.md
├── sdd-spec/SKILL.md
├── sdd-tasks/SKILL.md
├── sdd-verify/SKILL.md
├── go-testing/SKILL.md
├── judgment-day/SKILL.md
└── skill-creator/SKILL.md
```

---

## Stack-Specific Skills

**None detected for Next.js/React/TypeScript stack.**

Consider creating:
- `next-testing` — Next.js testing patterns (Jest, React Testing Library, Playwright)
- `react-patterns` — React component patterns, hooks best practices
- `tailwind-v4` — Tailwind CSS v4 CSS-first configuration patterns

---

## Notes

- No project-level skills (`.claude/skills/`, `.agent/skills/`, `skills/`) detected
- No convention index files (AGENTS.md, agents.md) found
- Persistence mode: **engram** (no openspec directory created)
