import { Hono } from "hono";
import * as hitEffectController from "../controllers/hitEffect.controller.ts";

const hitEffectRouter = new Hono();

hitEffectRouter.post("/", hitEffectController.create);
hitEffectRouter.get("/", hitEffectController.getAll);
hitEffectRouter.get("/:id", hitEffectController.getById);
hitEffectRouter.patch("/:id", hitEffectController.update);
hitEffectRouter.delete("/:id",  hitEffectController.del);

export { hitEffectRouter };
