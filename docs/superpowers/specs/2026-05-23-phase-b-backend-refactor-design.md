# Phase B — Backend Refactor + Security Fixes Design

**Date:** 2026-05-23
**Scope:** Second sub-project of "polish existing project" upgrade. Standard scope (option 2 of 3).
**Status:** Approved by user (2026-05-23).
**Precondition:** Phase A complete (commit `84a602a`).

---

## Context

Phase A integration testing uncovered backend bugs that block usable end-to-end flow even with JWT fix:

- `POST /victim` fails with `userId: undefined` Prisma error.
- `hp` stored as `1` regardless of request body.
- Every victim/hitEffect route except `POST /victim` is public — any client can read, update, or delete any user's data by guessing IDs.
- JWT_SECRET falls back to literal `"jwt-secret-key"` silently if env missing.
- `process.exit(1)` on unhandled rejection / uncaught exception kills the dev server on any transient error.
- Mixed `.js`/`.ts` import suffixes, dead imports, duplicate type declarations, dead `status` arg in `handleError`.

Standard scope = critical bug fixes + code-quality hygiene + Strict ownership pattern. Defers zod validation, response-shape normalization, and frontend axios cleanup to Phase C.

---

## Goals

1. Close security holes — no cross-user data access.
2. Restore `hp` round-trip.
3. Fail fast at boot on missing critical env vars.
4. Stop killing the server on transient errors.
5. Clean dead code, duplicate types, inconsistent imports.
6. Zero new features. Zero visual changes.
7. Response shapes unchanged (Phase C territory) — minimal frontend coupling.

## Non-goals

- Response envelope normalization (Phase C).
- Zod schemas (Phase C / Full scope).
- Duplicate axios instance + hardcoded `localhost:3000` in frontend (Phase C).
- CORS origin list (acceptable for dev).
- Bcrypt rounds change.
- Tests (Phase E).

---

## Decisions (locked)

- **Ownership strategy: Strict.** Backend ignores body/URL userId for write paths; for read paths, owner check returns 403 on mismatch. `getAll` routes dropped.
- **hitEffect ownership:** transitive through `hitEffect.victim.userId`.
- **`process.exit(1)`:** removed from uncaught handlers — log only.
- **`JWT_SECRET`:** throw at module load if missing. No silent fallback.
- **Frontend coupling:** minimal updates included in Phase B (rename `getVictimbyUserId` → `getMyVictims`, drop arg, change URL).

---

## Deliverables

### Critical bug fixes

**B-1. Victim userId spoofing** — `backend/src/controllers/victim.controller.ts:31`

Replace `VictimModel.createVictim(body)` with explicit field assembly using `c.get('user').id`:

```ts
const user = c.get('user');
const newVictim = await VictimModel.createVictim({
  name: body.name,
  reason: body.reason,
  hp: body.hp,
  userId: user.id,
});
```

**B-2. `hp` hardcode** — `backend/src/models/victim.models.ts:32`

Change `hp: 1,` to `hp: victim.hp,`. Remove the commented-out line.

**B-3. Public victim/hitEffect routes**

Add `authMiddleware` via `Router.use("*", authMiddleware)` at top of both `victim.route.ts` and `hitEffect.route.ts`. Drop `getAllVictim` route (was a cross-user dump). Replace with scoped `GET /victim`. See Section "Strict ownership pattern (full route map)" below.

### Code-quality fixes

**B-4. `handleError` dead `status` arg** — `backend/src/controllers/auth.controller.ts:7-10`

Use the parameter; return the actual message string instead of hardcoded "Error occured":

```ts
const handleError = (c: Context, error: any, message: string, status: ContentfulStatusCode = 500) => {
    console.error(`${message}:`, error);
    return c.json({ success: false, message }, status);
};
```

(Import `ContentfulStatusCode` from `hono/utils/http-status` if needed.)

**B-5. JWT_SECRET fail-fast** — `backend/src/middlewares/auth.middlewares.ts:6`

```ts
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET required");
export const JWT_SECRET = secret;
```

**B-6. Un-awaited promise log** — `backend/src/controllers/victim.controller.ts:20`

Delete the line (`console.log("createVictim called with:", c.req.json())` — logs a Promise object).

**B-7. Unused imports** — `backend/src/models/victim.models.ts:1,4`

Remove:
- `import { error } from "console"`
- `import { use } from "hono/jsx"`

**B-8. Duplicate `VictimType`** — defined in both `victim.controller.ts:5-10` and `victim.models.ts:6-12`.

Move both type definitions to `backend/src/types/type.ts`. Rename `createVictim` → `CreateVictimInput` (PascalCase, TS convention). Import everywhere.

**B-9. Mixed `.js`/`.ts` import suffixes**

Normalize on `.ts`. Files affected:
- `backend/src/routes/index.route.ts` (already `.ts` for `hitEffect`, `victim`; `auth` imports `auth.route.js` — fix)
- `backend/src/routes/auth.route.ts:2,3` (imports `auth.controller.js`, `auth.middlewares.js` — fix)
- `backend/src/routes/victim.route.ts:3` (imports `auth.middlewares.js` — fix)
- `backend/src/controllers/auth.controller.ts:2,3` (imports `auth.models.js`, `auth.middlewares.js` — fix)
- `backend/src/models/auth.models.ts:1,3` (imports `index.js`, `type.js` — fix)

Verify `backend/tsconfig.json` has `"allowImportingTsExtensions": true` and `"noEmit": true` (or move all imports to no-extension). Add if missing.

**B-12. Duplicated email regex** — `auth.controller.ts:5`, `auth.models.ts:12`, `auth.models.ts:76`.

Extract to `backend/src/utils/validation.ts` (new):

```ts
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (s: string): boolean => EMAIL_RE.test(s);
```

Import + use in all 3 locations.

**B-13. `process.exit(1)` on uncaught** — `backend/src/index.ts:27-35`

Remove `process.exit(1)` calls from `uncaughtException` and `unhandledRejection` handlers. Keep the `console.error` calls. Keep SIGINT/SIGTERM graceful-shutdown handlers (they still exit cleanly on purpose).

```ts
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

### Strict ownership pattern

**New file: `backend/src/middlewares/ownership.middlewares.ts`**

```ts
import type { Context, Next } from "hono";
import { db } from "../index.ts";

export const requireOwnVictim = async (c: Context, next: Next) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ success: false, message: "Invalid id" }, 400);

    const victim = await db.victim.findUnique({ where: { id } });
    if (!victim) return c.json({ success: false, message: "Not found" }, 404);

    const user = c.get('user');
    if (victim.userId !== user.id) return c.json({ success: false, message: "Forbidden" }, 403);

    c.set('victim', victim);
    await next();
};

export const requireOwnHitEffect = async (c: Context, next: Next) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ success: false, message: "Invalid id" }, 400);

    const hit = await db.hitEffect.findUnique({ where: { id }, include: { victim: true } });
    if (!hit) return c.json({ success: false, message: "Not found" }, 404);

    const user = c.get('user');
    if (hit.victim.userId !== user.id) return c.json({ success: false, message: "Forbidden" }, 403);

    c.set('hitEffect', hit);
    await next();
};
```

**Rewritten `backend/src/routes/victim.route.ts`:**

```ts
import { Hono } from "hono";
import { VictimController } from "../controllers/victim.controller.ts";
import { authMiddleware } from "../middlewares/auth.middlewares.ts";
import { requireOwnVictim } from "../middlewares/ownership.middlewares.ts";

const VictimRouter = new Hono();

VictimRouter.use("*", authMiddleware);

VictimRouter.get("/",       VictimController.getMyVictims);
VictimRouter.post("/",      VictimController.createVictim);
VictimRouter.get("/:id",    requireOwnVictim, VictimController.getVictimbyID);
VictimRouter.patch("/:id",  requireOwnVictim, VictimController.EditVictim);
VictimRouter.delete("/:id", requireOwnVictim, VictimController.deleteVictim);

export default VictimRouter;
```

Routes dropped:
- `GET /victim` (was unscoped `getAllVictim`) — replaced with scoped version above.
- `GET /victim/UserId/:id` — superseded by `GET /victim`.
- `GET /victim/getbyid/:id` — superseded by `GET /victim/:id`.

**New `getMyVictims` controller** — in `victim.controller.ts`:

```ts
getMyVictims: async (c: Context) => {
    try {
        const user = c.get('user');
        const list = await VictimModel.getVictimByUserId(user.id);
        return c.json({ success: true, data: list, msg: "Victims of user" });
    } catch (e) {
        return c.json({ success: false, data: null, msg: `Internal Server Error : ${e}` }, 500);
    }
},
```

**Rewritten `backend/src/routes/hitEffect.route.ts`:**

```ts
import { Hono } from "hono";
import * as hitEffectController from "../controllers/hitEffect.controller.ts";
import { authMiddleware } from "../middlewares/auth.middlewares.ts";
import { requireOwnHitEffect } from "../middlewares/ownership.middlewares.ts";

const hitEffectRouter = new Hono();

hitEffectRouter.use("*", authMiddleware);

hitEffectRouter.get("/",         hitEffectController.getMyHitEffects);
hitEffectRouter.post("/",        hitEffectController.create);
hitEffectRouter.get("/:id",      requireOwnHitEffect, hitEffectController.getById);
hitEffectRouter.patch("/:id",    requireOwnHitEffect, hitEffectController.update);
hitEffectRouter.delete("/:id",   requireOwnHitEffect, hitEffectController.del);

export { hitEffectRouter };
```

**hitEffect `create` controller adds ownership preflight on `body.victimId`:**

```ts
const user = c.get('user');
const victim = await db.victim.findUnique({ where: { id: body.victimId } });
if (!victim || victim.userId !== user.id) {
    return c.json({ success: false, msg: "Invalid victim", data: null }, 403);
}
```

**New `getMyHitEffects` model + controller:**

```ts
// hitEffect.model.ts
export const getMyHitEffects = async (userId: number) => {
    return db.hitEffect.findMany({ where: { victim: { userId } } });
};
```

```ts
// hitEffect.controller.ts
export const getMyHitEffects = async (c: Context) => {
    try {
        const user = c.get('user');
        const list = await hitEffectModel.getMyHitEffects(user.id);
        return c.json({ success: true, data: list, msg: "Hit effects of user" });
    } catch (e) {
        return c.json({ success: false, data: null, msg: "Error" }, 500);
    }
};
```

Old `getAll` is dropped from routes but kept exported (unused). Cleanup in Phase C / refactor sweep.

### Frontend coupling (minimal)

**`frontend/src/api/Victim.jsx`** — replace `getVictimbyUserId(id)` with `getMyVictims()`:

```js
export const getMyVictims = async () => {
    try {
        const response = await Axios.get(`/victim`);
        return { success: true, data: response.data };
    } catch (e) {
        console.log(e);
        return { success: false, data: null };
    }
};
```

`getVictimbyId(id)` keeps the name, but its URL changes from `/victim/getbyid/${id}` → `/victim/${id}`.

**`frontend/src/api/hitEffectAPI.js`** — rename `getAllHitEffects` → `getMyHitEffects`. URL stays `/hitEffect` (now scoped on backend).

**Find + update all callers** in `frontend/src/pages/*` and `frontend/src/components/*` via grep before commit.

---

## Verification

curl-based (no test framework yet):

1. Register `userA` + `userB`; capture both cookies.
2. `userA` `POST /victim {name,reason,hp:50, userId:999 /* spoofed */}` → 201. Verify stored `userId === userA.id`, `hp === 50`.
3. `userA` `GET /victim` → returns only A's victims.
4. `userA` `GET /victim/<B's id>` → 403.
5. `userA` `PATCH /victim/<B's id>` → 403.
6. `userA` `DELETE /victim/<B's id>` → 403.
7. Unauth'd `GET /victim` → 401.
8. Repeat 3–7 against `/hitEffect`.
9. Unset `JWT_SECRET`, restart backend → process throws `JWT_SECRET required` at boot; backend does not start.
10. Trigger an uncaught error inside a controller (e.g. `throw new Error("test")` outside the try/catch) → server logs but stays up; next request to a healthy route succeeds.
11. Frontend smoke: login → home → add victim with `hp=80` → `userDetail` shows hp=80 → BoxingRing decrements HP.

Acceptance: all 11 pass.

---

## Risks + mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Phase B URL change breaks frontend pages besides victim list | Medium | Grep all callers of renamed functions before commit; smoke test each page (home, auth, userDetail, boxingRing, funeral, forgive) |
| `allowImportingTsExtensions` unsupported / tsconfig path issue | Low | Verify before commit; fallback = drop suffixes entirely if `tsc --noEmit` errors |
| Owner check N+1 on hitEffect | Low | One `findUnique` with `include: { victim: true }` = one query |
| Removing `process.exit(1)` masks real crashes | Medium | Document in README troubleshooting; in production rely on PM2/Docker restart policy (Phase D / deploy work) |
| Renamed grep misses a caller | Medium | After grep, also run `pnpm build` on frontend — Vite errors on undefined imports if any caller still references the old name |
| `hitEffect.getAll` controller becomes dead code | Low | Acceptable; export remains but no route uses it. Cleanup in Phase C. |

---

## Implementation order

1. Add `backend/src/utils/validation.ts` (new file — `EMAIL_RE`, `isValidEmail`).
2. Move/dedupe `VictimType` + `CreateVictimInput` into `backend/src/types/type.ts`.
3. Add `backend/src/middlewares/ownership.middlewares.ts` (new).
4. Edit `backend/src/middlewares/auth.middlewares.ts` — JWT_SECRET fail-fast.
5. Edit `backend/src/index.ts` — drop `process.exit(1)` from uncaught handlers.
6. Edit `backend/src/controllers/auth.controller.ts` — fix `handleError` `status` arg + use real `message`; import `isValidEmail`.
7. Edit `backend/src/models/auth.models.ts` — import `isValidEmail`; drop inline regexes.
8. Rewrite `backend/src/controllers/victim.controller.ts` — drop dup type, use `c.get('user').id` for create, add `getMyVictims`, drop un-awaited `console.log`.
9. Rewrite `backend/src/models/victim.models.ts` — drop dead imports + dup type, fix `hp` hardcode.
10. Rewrite `backend/src/routes/victim.route.ts` — `use(authMiddleware)`, new map, owner guards.
11. Edit `backend/src/models/hitEffect.model.ts` — add `getMyHitEffects`.
12. Edit `backend/src/controllers/hitEffect.controller.ts` — ownership preflight on `create`, add `getMyHitEffects` controller.
13. Rewrite `backend/src/routes/hitEffect.route.ts` — `use(authMiddleware)`, new map, owner guards.
14. Normalize `.js`→`.ts` import suffixes across `routes/`, `controllers/`, `models/`. Verify `tsconfig.json` setting.
15. Edit `frontend/src/api/Victim.jsx` — rename `getVictimbyUserId` → `getMyVictims`, URL change. Also fix `getVictimbyId` URL `/victim/getbyid/:id` → `/victim/:id`.
16. Edit `frontend/src/api/hitEffectAPI.js` — rename `getAllHitEffects` → `getMyHitEffects`.
17. Grep + update callers of renamed functions in `frontend/src/pages/*` and `frontend/src/components/*`.
18. Run `pnpm build` in frontend — confirm no broken imports.
19. Manual verification per Section 7.
20. Commit as `refactor(backend): phase B — security + cleanup` (or split per concern: security, cleanup, types, frontend coupling).

---

## Decision log

- **2026-05-23** — Standard scope (option 2 of 3). Full scope (zod + response normalization) rejected — defer to Phase C.
- **2026-05-23** — Strict ownership (option 1 of 3). Drops `getAllVictim` and `/victim/UserId/:id`. Couples frontend Victim.jsx change.
- **2026-05-23** — JWT_SECRET fail-fast: throw at module load.
- **2026-05-23** — `process.exit(1)` on uncaught: removed; log only.
- **2026-05-23** — `hitEffect` ownership: transitive through `victim.userId`.
- **2026-05-23** — Frontend coupling: include minimal route renames in Phase B to keep app functional after merge; rest of frontend refactor is Phase C.
