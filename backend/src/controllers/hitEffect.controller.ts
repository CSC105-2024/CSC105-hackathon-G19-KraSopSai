import * as hitEffectModel from "../models/hitEffect.model.ts";
import type { Context } from "hono";

export const create = async (c: Context) => {
  try {
    const body = await c.req.json();
    if (!body.title || !body.victimId) {
      return c.json(
        {
          success: false,
          msg: "Missing title or victimId",
          data: null,
        },
        400
      );
    } 
    const newhitEffect = await hitEffectModel.createHitEffect(body);
    return c.json({
      success: true,
      msg: "hitEffect created successfully",
      data: newhitEffect,
    });
  } catch (e) {
    return c.json(
      {
        success: false,
        msg: "Error creating hitEffect",
        data: null,
      },
      400
    );
  }
};

export const getAll = async (c: Context) => {
  try {
    const hitEffect = await hitEffectModel.getAllHitEffects();
    return c.json({
      success: true,
      msg: "Successfully Get all hitEffect",
      data: hitEffect,
    });
  } catch (e) {
    return c.json(
      {
        success: false,
        msg: "Error getting hitEffects",
        data: null,
      },
      400
    );
  }
};

  export const getById = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json(
        {
          success: false,
          msg: "Invalid ID format",
          data: null,
        },
        400
      );
    }
    const hitEffect = await hitEffectModel.getHitEffectById(id);
    if (!hitEffect) {
      return c.json(
        {
          success: false,
          msg: "hitEffect not found",
          data: null,
        },
        404
      );
    }
    return c.json(
      {
        success: true,
        msg: "Successfully Get hitEffect",
        data: hitEffect,
      },
      200
    );
  } catch (e) {
    return c.json(
      {
        success: false,
        msg: "Error getting hitEffect",
        data: null,
      },
      400
    );
  }
};

export const update = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json(
        {
          success: false,
          msg: "Invalid ID format",
          data: null,
        },
        400
      );
    }
    const body = await c.req.json();
    const updatedHitEffect = await hitEffectModel.update(id, body);
    if (!updatedHitEffect) {
      return c.json(
        {
          success: false,
          msg: "hitEffect not found",
          data: null,
        },
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
      {
        success: false,
        msg: "Error updating hitEffect",
        data: null,
      },
      400
    );
  }
};

export const del = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json(
        {
          success: false,
          msg: "Invalid ID format",
          data: null,
        },
        400
      );
    }
    await hitEffectModel.deleteHitEffect(id);
    return c.json({
      success: true,
      msg: "hitEffect deleted successfully",
      data: null,
    });
  } catch (e) {
    return c.json(
      {
        success: false,
        msg: "Error deleting hitEffect",
        data: null,
      },
      400
    );
  }
};