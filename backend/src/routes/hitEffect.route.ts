import { Hono } from "hono";
import * as hitEffectController from "../controllers/hitEffect.controller.ts";
import { authMiddleware } from "../middlewares/auth.middlewares.ts";
import { requireOwnHitEffect } from "../middlewares/ownership.middlewares.ts";

const hitEffectRouter = new Hono();

hitEffectRouter.use("*", authMiddleware);

hitEffectRouter.get("/",       hitEffectController.getMyHitEffects);
hitEffectRouter.post("/",      hitEffectController.create);
hitEffectRouter.get("/:id",    requireOwnHitEffect, hitEffectController.getById);
hitEffectRouter.patch("/:id",  requireOwnHitEffect, hitEffectController.update);
hitEffectRouter.delete("/:id", requireOwnHitEffect, hitEffectController.del);

export { hitEffectRouter };
