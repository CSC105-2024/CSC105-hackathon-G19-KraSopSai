import { Hono } from "hono";
import { hitEffectRouter } from "./hitEffect.route.ts";
import VictimRouter from "./victim.route.ts";
import auth from "./auth.route.js";

const mainRouter = new Hono();

mainRouter.route("/hitEffect", hitEffectRouter);
mainRouter.route("/victim", VictimRouter);
mainRouter.route("/auth", auth);

export { mainRouter };