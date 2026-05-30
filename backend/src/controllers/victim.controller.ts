import type { Context } from "hono";
import { VictimModel } from "../models/victim.models.ts";

export const VictimController = {
    createVictim: async (c: Context) => {
        try {
            const body = await c.req.json();
            if (!body || !body.name || !body.reason || body.hp == null) {
                return c.json({
                    success: false,
                    data: null,
                    msg: 'Missing required field (name, reason, hp)',
                }, 400);
            }

            const user = c.get('user');
            const newVictim = await VictimModel.createVictim({
                name: body.name,
                reason: body.reason,
                hp: Number(body.hp),
                userId: user.id,
            });

            return c.json({
                success: true,
                data: newVictim,
                msg: 'Successfully created new Victim',
            }, 201);
        } catch (e) {
            return c.json(
                { success: false, data: null, msg: `Internal Server Error : ${e}` },
                500
            );
        }
    },

    getMyVictims: async (c: Context) => {
        try {
            const user = c.get('user');
            const list = await VictimModel.getVictimByUserId(user.id);
            return c.json({
                success: true,
                data: list,
                msg: 'Victims of user',
            });
        } catch (e) {
            return c.json(
                { success: false, data: null, msg: `Internal Server Error : ${e}` },
                500
            );
        }
    },

    getVictimbyID: async (c: Context) => {
        try {
            // requireOwnVictim middleware already loaded + verified record
            const victim = c.get('victim');
            return c.json({
                success: true,
                data: victim,
                msg: 'Victim by id',
            });
        } catch (e) {
            return c.json(
                { success: false, data: null, msg: `Internal Server Error : ${e}` },
                500
            );
        }
    },

    EditVictim: async (c: Context) => {
        try {
            const id = Number(c.req.param('id'));
            const body = await c.req.json();
            if (!body) {
                return c.json({ success: false, data: null, msg: 'missing data' }, 400);
            }

            const user = c.get('user');
            const upVictim = await VictimModel.updateVictim(id, {
                name: body.name,
                reason: body.reason,
                hp: Number(body.hp),
                userId: user.id, // force ownership; ignore any spoofed body.userId
            });

            return c.json({
                success: true,
                data: upVictim,
                msg: 'Edit Victim!',
            });
        } catch (e) {
            return c.json(
                { success: false, data: null, msg: `Internal Server Error : ${e}` },
                500
            );
        }
    },

    deleteVictim: async (c: Context) => {
        try {
            const id = Number(c.req.param('id'));
            const deleted = await VictimModel.deleteVictim(id);
            return c.json({
                success: true,
                data: deleted,
                msg: 'delete Victim',
            });
        } catch (e) {
            return c.json(
                { success: false, data: null, msg: `Internal Server Error : ${e}` },
                500
            );
        }
    },

    addStats: async (c: Context) => {
        try {
            const id = Number(c.req.param('id'));
            const body = await c.req.json();
            const hits = Math.max(0, Number(body.hits) || 0);
            const deaths = Math.max(0, Number(body.deaths) || 0);
            const updated = await VictimModel.incrementStats(id, hits, deaths);
            return c.json({
                success: true,
                data: updated,
                msg: 'stats updated',
            });
        } catch (e) {
            return c.json(
                { success: false, data: null, msg: `Internal Server Error : ${e}` },
                500
            );
        }
    },
};
