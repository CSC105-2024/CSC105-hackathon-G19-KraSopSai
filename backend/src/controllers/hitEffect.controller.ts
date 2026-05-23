import type { Context } from "hono";
import * as hitEffectModel from "../models/hitEffect.model.ts";
import { db } from "../index.ts";

export const create = async (c: Context) => {
  try {
    const body = await c.req.json();
    if (!body.title || !body.victimId) {
      return c.json(
        { success: false, msg: "Missing title or victimId", data: null },
        400
      );
    }

    const user = c.get('user');
    const victim = await db.victim.findUnique({ where: { id: Number(body.victimId) } });
    if (!victim || victim.userId !== user.id) {
      return c.json(
        { success: false, msg: "Invalid victim", data: null },
        403
      );
    }

    const newhitEffect = await hitEffectModel.createHitEffect({
      title: body.title,
      victimId: Number(body.victimId),
    });
    return c.json({
      success: true,
      msg: "hitEffect created successfully",
      data: newhitEffect,
    }, 201);
  } catch (e) {
    return c.json(
      { success: false, msg: "Error creating hitEffect", data: null },
      400
    );
  }
};

export const getMyHitEffects = async (c: Context) => {
  try {
    const user = c.get('user');
    const list = await hitEffectModel.getMyHitEffects(user.id);
    return c.json({
      success: true,
      msg: "Hit effects of user",
      data: list,
    });
  } catch (e) {
    return c.json(
      { success: false, msg: "Error getting hitEffects", data: null },
      500
    );
  }
};

export const getById = async (c: Context) => {
  try {
    const hitEffect = c.get('hitEffect');
    return c.json({
      success: true,
      msg: "Successfully Get hitEffect",
      data: hitEffect,
    }, 200);
  } catch (e) {
    return c.json(
      { success: false, msg: "Error getting hitEffect", data: null },
      400
    );
  }
};

export const update = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    if (!body.title || !body.victimId) {
      return c.json(
        { success: false, msg: "Missing title or victimId", data: null },
        400
      );
    }

    const user = c.get('user');
    const targetVictim = await db.victim.findUnique({ where: { id: Number(body.victimId) } });
    if (!targetVictim || targetVictim.userId !== user.id) {
      return c.json(
        { success: false, msg: "Invalid victim", data: null },
        403
      );
    }

    const updatedHitEffect = await hitEffectModel.update(id, {
      title: body.title,
      victimId: Number(body.victimId),
    });
    if (!updatedHitEffect) {
      return c.json(
        { success: false, msg: "hitEffect not found", data: null },
        404
      );
    }
    return c.json({
      success: true,
      msg: "hitEffect updated successfully",
      data: updatedHitEffect,
    });
  } catch (e) {
    return c.json(
      { success: false, msg: "Error updating hitEffect", data: null },
      400
    );
  }
};

export const del = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    await hitEffectModel.deleteHitEffect(id);
    return c.json({
      success: true,
      msg: "hitEffect deleted successfully",
      data: null,
    });
  } catch (e) {
    return c.json(
      { success: false, msg: "Error deleting hitEffect", data: null },
      400
    );
  }
};
