import { Hono } from "hono";
import { VictimController } from "../controllers/victim.controller.ts";
import { authMiddleware } from "../middlewares/auth.middlewares.ts";
import { requireOwnVictim } from "../middlewares/ownership.middlewares.ts";

const VictimRouter = new Hono();

VictimRouter.use("*", authMiddleware);

VictimRouter.get("/",       VictimController.getMyVictims);
VictimRouter.post("/",      VictimController.createVictim);
VictimRouter.get("/:id",    requireOwnVictim, VictimController.getVictimbyID);
VictimRouter.post("/:id/stats", requireOwnVictim, VictimController.addStats);
VictimRouter.patch("/:id",  requireOwnVictim, VictimController.EditVictim);
VictimRouter.delete("/:id", requireOwnVictim, VictimController.deleteVictim);

export default VictimRouter;
