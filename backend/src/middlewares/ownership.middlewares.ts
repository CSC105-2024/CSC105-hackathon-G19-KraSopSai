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

    const hit = await db.hitEffect.findUnique({
        where: { id },
        include: { victim: true },
    });
    if (!hit) return c.json({ success: false, message: "Not found" }, 404);

    const user = c.get('user');
    if (hit.victim.userId !== user.id) return c.json({ success: false, message: "Forbidden" }, 403);

    c.set('hitEffect', hit);
    await next();
};
