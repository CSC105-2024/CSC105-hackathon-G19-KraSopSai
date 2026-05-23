# Phase A — Repo Hygiene Design

**Date:** 2026-05-23
**Scope:** First sub-project of "polish existing project" upgrade.
**Status:** Approved by user (2026-05-23).

---

## Context

Project: `CSC105-hackathon-G19-KraSopSai` — React 19 + Vite frontend, Hono + Prisma + MySQL backend. Punch-a-victim hate-vent mechanic (User → Victim w/ HP → HitEffect).

User recently cloned and the project does not run from a fresh clone:

- `backend/.env` not present (no example)
- `frontend/.env` not present (no example)
- Prisma client not generated (gitignored, expected)
- `node_modules/` absent both sides (expected after clone)
- README is one line: `# CSC105-hackathon-G19-KraSopSai`
- `frontend/src/pages/TestComponent.jsx` is a dev leftover wired to route `/Test`
- `backend/package.json` lists both `bcrypt` (used) and `bcryptjs` (unused) — duplicate dependency
- `main.jsx:8` imports `./pages/userDetail.jsx` but file is `UserDetail.jsx` — case-only mismatch that breaks case-sensitive filesystems (Linux deploy targets, Docker)

Polish must respect existing visual/style decisions. Phase A is non-visual.

---

## Goals

1. Fresh clone runnable in ≤5 min following root README.
2. Remove dev leftovers and duplicate dependencies.
3. Fix case-sensitivity import bug (cross-platform safety).
4. Zero behavior change for existing users; zero visual change.

## Non-goals

- Refactoring backend or frontend code (deferred to Phase B / C).
- Adding any tests (deferred to Phase E).
- UI/UX changes of any kind (deferred to Phase D).
- Setup automation scripts (rejected by user — Standard scope chosen, not Full).

---

## Deliverables

### 1. `backend/.env.example` (new file)

Plain-text placeholders with inline comments. Committed to git. Real `.env` stays gitignored.

```env
# MySQL connection — see README for setup options (Docker, native, cloud)
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/krasopsai"
SHADOW_DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/krasopsai_shadow"

# JWT signing key — generate with:
#   PowerShell:  -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 48 | % {[char]$_})
#   Bash:        openssl rand -base64 36
# Keep secret. Never commit the real value.
JWT_SECRET="replace-with-long-random-string"

PORT=3000
NODE_ENV=development
```

### 2. `frontend/.env.example` (new file)

```env
# Backend API base URL
VITE_API_URL=http://localhost:3000
```

### 3. `README.md` (root — full rewrite, keep existing title)

Sections, in order:

1. **Title + one-line description** — keep `# CSC105-hackathon-G19-KraSopSai` line; add one tagline below.
2. **Tech stack** — bulleted: React 19, Vite, Tailwind v4, react-router v7, react-hook-form, zod (frontend); Hono, Prisma, MySQL, JWT, bcrypt (backend).
3. **Prereqs** — Node 20+, pnpm 10+, MySQL 8 (or Docker).
4. **Setup** — numbered steps:
   1. Clone
   2. Copy both `.env.example` → `.env`, fill values
   3. MySQL: Docker one-liner OR native install OR cloud (link out)
   4. Generate `JWT_SECRET` (PowerShell + Bash one-liners)
   5. Backend: `cd backend && pnpm install && pnpm prisma generate && pnpm prisma migrate deploy && pnpm dev`
   6. Frontend (new terminal): `cd frontend && pnpm install && pnpm dev`
5. **Smoke test** — checklist: open `localhost:5173`, register, login, add victim, hit boxing ring, verify HP drops.
6. **Project structure** — `tree -L 2`-style ASCII tree of `backend/` and `frontend/`.
7. **Troubleshooting** — three bullets: pnpm missing → `npm i -g pnpm`; MySQL connection refused → check service running; Prisma `P1001` → check `DATABASE_URL` host/port.

Length target: ~120 lines max. No marketing copy.

### 4. `backend/package.json` (modify)

Remove `"bcryptjs": "^3.0.2"` from `dependencies`. Remove `@types/bcryptjs` from `devDependencies` if present (not currently listed — confirm during implementation). Keep `bcrypt` and `@types/bcrypt`. Run `pnpm install` after to regenerate lockfile.

No source changes — `backend/src/models/auth.models.ts` already imports from `"bcrypt"` (verified at lines 2, 48, 84, 202).

### 5. `frontend/src/pages/TestComponent.jsx` (delete)

Hard delete. Remove these lines from `frontend/src/main.jsx`:

- Line 11: `import TestComponent from './pages/TestComponent.jsx';`
- Lines 39–42: the route object `{ path: "/Test", element: <TestComponent/> }` plus its trailing comma if it leaves a syntactic gap.

### 6. `frontend/src/main.jsx` — case fix

Line 8: `import UserDetail from './pages/userDetail.jsx';` → `import UserDetail from './pages/UserDetail.jsx';` (capital `U`). Actual filename per `ls` output is `UserDetail.jsx`.

---

## Out of scope, left untouched

- `/fu` route → `<FuneralPopup/>` and `/del` route → `<Forgive/>` — appear to be dev preview routes for components. Style/convenience choice. Not removed.
- `process.exit(1)` on uncaughtException in `backend/src/index.ts` — deferred to Phase B.
- Mixed `.ts`/`.js` import extensions in route files — deferred to Phase B.
- Empty `backend/README.md` and `frontend/README.md` — left as-is; root README is single source of truth.

---

## Verification

Manual verification, no automated tests added in this phase.

1. Stash work, simulate fresh clone (`git clean -fdx` in scratch worktree).
2. Follow new `README.md` literally on a Windows machine with Docker MySQL.
3. App loads at `http://localhost:5173`. Auth flow works. Add victim, hit, HP drops.
4. `pnpm install` in `backend/` emits no warnings about duplicate bcrypt packages.
5. Navigate to `http://localhost:5173/Test` → renders `NotFoundPage` (404 catch-all).
6. `grep -ri "TestComponent" frontend/src` returns nothing.
7. On case-sensitive filesystem (Docker Linux container or WSL), `pnpm build` succeeds — `UserDetail` import resolves.

Acceptance: all 7 pass.

---

## Risks and mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `bcrypt` native build fails on Windows post-clone | Medium | README troubleshooting note; if widespread, fallback = revert to `bcryptjs` and update imports (one file, 4 lines) |
| User has existing `.env` that diverges from example | Low | `.env.example` only; never touch `.env` |
| Removing `/Test` route breaks unknown dev bookmarks | Low | Acceptable — `/Test` was unlisted, used only by dev |
| Case fix on `UserDetail` import breaks Windows runtime | Very low | Windows is case-insensitive; capital form matches filename exactly |
| README rewrite loses info from current one-line README | None | Current README contains no info beyond the title |

---

## Implementation order (for the plan)

1. Write `backend/.env.example`
2. Write `frontend/.env.example`
3. Delete `frontend/src/pages/TestComponent.jsx`
4. Edit `frontend/src/main.jsx` — remove TestComponent import + route, fix UserDetail case
5. Edit `backend/package.json` — drop `bcryptjs`
6. Run `pnpm install` in `backend/` to refresh lockfile
7. Rewrite root `README.md`
8. Manual verification per checklist above
9. Commit as single `chore: repo hygiene (phase A)` commit, or split per file group if reviewer prefers

---

## Decision log

- **2026-05-23** — Scope chosen: Standard (option 2 of 3). Full scope (setup scripts) rejected — user wants minimal automation, plain README sufficient.
- **2026-05-23** — Order: A → B → C → D → E (option 1 of 4).
- **2026-05-23** — bcrypt kept, bcryptjs dropped — verified `auth.models.ts` uses `bcrypt`.
- **2026-05-23** — Case-fix for `UserDetail` import added to scope mid-design (cross-platform bug, one-line fix, fits Phase A).
