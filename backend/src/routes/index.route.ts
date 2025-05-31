import { Hono } from "hono";
// import { hitEffectRouter } from "./hitEffect.route.ts";

const mainRouter = new Hono();

// mainRouter.route("/hitEffect", hitEffectRouter);

export { mainRouter };