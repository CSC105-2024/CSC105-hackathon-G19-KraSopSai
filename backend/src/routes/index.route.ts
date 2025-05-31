import { Hono } from "hono";
import { hitEffectRouter } from "./hitEffect.route.ts";
import { VictimRouter } from "./victim.route.ts";

const mainRouter = new Hono();

mainRouter.route("/hitEffect", hitEffectRouter);
mainRouter.route("/victim", VictimRouter);

export { mainRouter };