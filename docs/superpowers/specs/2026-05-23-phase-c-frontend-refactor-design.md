# Phase C — Frontend Refactor Design

**Date:** 2026-05-23
**Scope:** Third sub-project of "polish existing project" upgrade. Standard scope (option 2 of 3).
**Status:** Approved by user (2026-05-23).
**Preconditions:** Phase A (`84a602a`) complete; Phase B spec (`0926d5c`) approved; live bug-fix commit `6d2c35f` applied.

---

## Context

Phase A confirmed the frontend runs but has several structural smells deferred for Phase C:

- `frontend/src/api/Victim.jsx` declares its own `axios.create({baseURL: 'http://localhost:3000', ...})`, bypassing the shared `Axios` instance and its interceptors.
- `frontend/src/utils/axiosInstance.js` hardcodes `baseURL: 'http://localhost:3000'`. The `VITE_API_URL` env variable is dead.
- `react-hook-form`, `zod`, `@hookform/resolvers` are listed in `package.json` `dependencies` but never imported anywhere in `frontend/src/`.
- No React error boundary — any uncaught render error blanks the page.
- `frontend/src/utils/checkAuth.jsx` exports a component named `ProtectedRoute`; filename should match the export.
- `frontend/src/api/authService.jsx` and `frontend/src/api/Victim.jsx` carry `.jsx` extensions despite containing zero JSX (only API helper functions).
- `frontend/src/pages/Auth.jsx` bypasses `authService.jsx` and calls raw `Axios` directly. Localstorage write logic duplicates code in `authService.jsx`.
- After Phase B applies Strict ownership, several backend `getAll*` exports become dead code.

Standard scope = wire `VITE_API_URL`, dedupe axios, remove unused deps, add error boundary, file-rename hygiene, dead-code cleanup. **No visual / layout / animation changes.** No new abstractions. Adopting `authService.jsx` consistently is documented as a smell but deferred to a follow-up (would escalate to Full scope).

---

## Goals

1. Make `VITE_API_URL` actually drive axios — one source of truth for the API base URL.
2. Remove the duplicate `axios.create()` in `Victim.jsx`; route through shared instance and its interceptors.
3. Remove dead deps that bloat install + bundle.
4. Catch render-time errors with a global boundary so the app degrades to a "Reload" screen instead of a blank one.
5. Tidy filenames to match contents.
6. Strip dead `getAll*` exports left behind by Phase B's route changes.

## Non-goals

- Visual / layout / animation changes (explicit user preference: keep existing style).
- Refactoring `Auth.jsx` to consume `authService.js` (Full scope, deferred).
- Adopting `react-hook-form` + `zod` (rejected; removed instead).
- Response envelope normalization across pages (deferred; backend still returns mixed shapes after Phase B).
- DRY of email regex in frontend (negligible).
- Test infrastructure (Phase E).

---

## Decisions (locked)

- **Scope tier:** Standard (option 2 of 3).
- **`react-hook-form` + `zod`:** remove (option 1 of 3).
- **Error boundary:** single global boundary wrapping `<RouterProvider>` (option 1 of 3).
- **File renames:** all three (`checkAuth.jsx`→`ProtectedRoute.jsx`, `authService.jsx`→`authService.js`, `Victim.jsx`→`victim.js`).

---

## Deliverables

### C-1. Wire `VITE_API_URL` in shared axios instance

`frontend/src/utils/axiosInstance.js`:

```js
const Axios = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});
```

Fallback preserves current behavior if `.env` missing.

### C-2. Drop duplicate axios instance in Victim helper

`frontend/src/api/Victim.jsx` (will be renamed to `victim.js` in C-6): replace the local `axios.create({...})` block (lines 1-10) with:

```js
import { Axios } from '../utils/axiosInstance.js';
```

All existing functions reuse the shared `Axios`. Interceptors (401 redirect, error logging) now apply uniformly to victim endpoints.

### C-3. Remove unused frontend deps

`frontend/package.json` — remove from `dependencies`:

- `@hookform/resolvers`
- `react-hook-form`
- `zod`

Run `pnpm install` afterward to regenerate `pnpm-lock.yaml`. Verify with `pnpm build` that nothing imported them.

**Preflight grep (must come back empty):**

```bash
grep -r "react-hook-form\|@hookform\|from \"zod\"\|from 'zod'" frontend/src/
```

If any hit appears, abort C-3 and reconsider scope.

### C-4. Global error boundary

New file `frontend/src/components/ErrorBoundary.jsx`:

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error("Render error:", error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-screen p-8 text-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Something broke</h2>
                        <p className="text-gray-600 mb-4">Refresh the page to retry.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-pink-500 text-white rounded"
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
```

Wrap `<RouterProvider>` in `frontend/src/main.jsx`:

```jsx
import ErrorBoundary from './components/ErrorBoundary.jsx';
// ...
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ErrorBoundary>
            <RouterProvider router={router}/>
        </ErrorBoundary>
    </StrictMode>,
);
```

Tailwind classes mirror existing tokens (`bg-pink-500`, `text-gray-600`); zero impact on healthy paths. Only triggers on render-phase errors (not async/event-handler errors, by design — those should surface as toast/state elsewhere).

### C-5. authService usage cleanup (documented only, no code change)

`Auth.jsx` bypasses `authService.jsx` (raw `Axios.post('/auth/login')`). Documented as a known smell. Out of Standard scope — fixing would require also rewriting localStorage flow and error-message handling in Auth.jsx, which crosses the "respect existing style" boundary. Add a one-line comment near the top of `Auth.jsx` noting `authService.js` is the canonical layer for future consolidation.

### C-6. File renames

Use `git mv` for each so blame history follows:

| From | To |
|------|-----|
| `frontend/src/utils/checkAuth.jsx` | `frontend/src/utils/ProtectedRoute.jsx` |
| `frontend/src/api/authService.jsx` | `frontend/src/api/authService.js` |
| `frontend/src/api/Victim.jsx` | `frontend/src/api/victim.js` |

Update import paths in:

- `frontend/src/main.jsx:11` — `./utils/checkAuth.jsx` → `./utils/ProtectedRoute.jsx`
- `frontend/src/pages/UserDetail.jsx:5` — `../api/Victim.jsx` → `../api/victim.js`
- `frontend/src/pages/BoxingRing.jsx:5` — `../api/Victim` → `../api/victim.js`
- Any other callers — discover via `grep -rn "Victim\.jsx\|checkAuth\|authService\.jsx" frontend/src/`

### C-7. Dead-code cleanup (Phase B follow-up)

After Phase B merge, the following backend exports become dead:

- `backend/src/controllers/hitEffect.controller.ts#getAll` (dropped from `hitEffect.route.ts`)
- `backend/src/models/victim.models.ts#getAllVictim` (still exported but no controller calls it)
- `backend/src/controllers/victim.controller.ts#getAllVictim` (route gone)

Remove the function bodies + exports in Phase C unless Phase B picks them up. Track during implementation: if Phase B already removes them, skip C-7.

---

## Verification

1. `pnpm build` in `frontend/` produces a dist without errors (font-runtime warnings are pre-existing, ignore).
2. Bundle size drops vs pre-Phase-C (3 deps removed; sanity check `dist/assets/index-*.js` smaller).
3. Set `VITE_API_URL=http://localhost:3000`, restart dev → network requests go to 3000. Change to `http://localhost:9999`, restart → requests fail (proves the var is read).
4. Smoke flow with backend running: register, login, add victim, click victim → boxing ring, click face → HP decreases. Every page renders.
5. Force a render error (temp `throw new Error("test")` in a page render body) → boundary catches, "Something broke" UI appears, "Reload" works. Remove the temp throw afterward.
6. `ProtectedRoute` rename: `/userDetail` while logged out still redirects to `/auth`.
7. Grep `react-hook-form`, `@hookform`, `from "zod"`, `from 'zod'` across `frontend/src/` → empty.
8. Grep `Victim\.jsx`, `checkAuth`, `authService\.jsx` → empty (all updated to new paths).
9. No regressions in BoxingRing fetch (already fixed in `6d2c35f`).

Acceptance: all 9 pass.

---

## Risks + mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Removing `react-hook-form` / `zod` breaks a hidden import | Low | Preflight grep enforced before dep removal. |
| Caller import path missed during rename | Medium | After every rename, run `pnpm build` and grep for old name. |
| `VITE_API_URL` fallback masks broken `.env` in dev | Low | Documented in README troubleshooting (added in Phase A); fallback explicit. |
| Error boundary swallows errors that should bubble (e.g. event-handler throws) | Low | React error boundaries only catch render-phase errors by design. Async/event-handler errors still surface as before. |
| File rename via plain delete+create loses blame history | Low | Use `git mv` consistently. |
| Backend `getAll*` removed by both Phase B and Phase C — merge conflict | Low | Sequence Phase B before Phase C; check during C-7 whether the exports still exist. |
| Auth.jsx tightly couples to backend `{success, message}` shape — future backend change breaks login UI | Medium | Out of scope (deferred). Document only. |

---

## Implementation order

1. Preflight grep — verify zero usage of `react-hook-form`, `@hookform`, `from "zod"|'zod'` in `frontend/src/`. Abort C-3 if any hit.
2. Edit `frontend/src/utils/axiosInstance.js` — read `VITE_API_URL` with fallback.
3. Edit `frontend/src/api/Victim.jsx` — drop local `axios.create`, import shared `Axios`. (File will be renamed in step 6.)
4. `git mv` renames:
   a. `frontend/src/utils/checkAuth.jsx` → `frontend/src/utils/ProtectedRoute.jsx`
   b. `frontend/src/api/authService.jsx` → `frontend/src/api/authService.js`
   c. `frontend/src/api/Victim.jsx` → `frontend/src/api/victim.js`
5. Grep callers of all three old names; update import paths everywhere.
6. Add `frontend/src/components/ErrorBoundary.jsx` (new).
7. Edit `frontend/src/main.jsx` — wrap `RouterProvider` in `<ErrorBoundary>`; reflect renamed `ProtectedRoute` import (step 4a).
8. Edit `frontend/package.json` — remove `@hookform/resolvers`, `react-hook-form`, `zod`. Run `pnpm install` in `frontend/`.
9. Edit `frontend/src/pages/Auth.jsx` — add one-line comment near top pointing to `authService.js`.
10. (If Phase B did not already) Remove dead `getAll*` exports in `hitEffect.controller.ts`, `victim.controller.ts`, `victim.models.ts`.
11. `pnpm build` in `frontend/` — confirm clean.
12. Manual verification per "Verification" section.
13. Commit as `refactor(frontend): phase C — wiring + cleanup` (or split: deps removal, axios wiring, renames, error boundary).

---

## Decision log

- **2026-05-23** — Standard scope chosen. Full scope (adopt `react-hook-form` + `zod`, route `Auth.jsx` through `authService.js`) deferred.
- **2026-05-23** — `react-hook-form` / `zod` / `@hookform/resolvers` removed (option 1 of 3). User preference: keep existing hand-rolled validation.
- **2026-05-23** — Global single error boundary (option 1 of 3).
- **2026-05-23** — Three file renames confirmed (`a=Y, b=Y, c=Y`).
- **2026-05-23** — `Auth.jsx` consolidation onto `authService.js` deferred; only a "see authService.js" comment added in Standard scope.
- **2026-05-23 (live)** — Four bugs fixed inline before spec write, in commit `6d2c35f`:
  1. `UserDetail.jsx` — victim card name area made clickable, navigates to `/boxingRing?id=<id>`.
  2. `Victim.jsx#getVictimbyId` — removed stray `console.log("Creating job with data:", data)` referencing undefined `data` (always threw ReferenceError before the fetch).
  3. `BoxingRing.jsx` — `result.response.success` → `result.success`; `result.response.data` → `result.data`.
  4. `BoxingRing.jsx` — declared missing `loading` and `error` state hooks that were being set without prior declaration.
  These were prerequisites for end-to-end victim → boxing-ring flow; not Phase C refactor items themselves. Phase C scope unchanged.
