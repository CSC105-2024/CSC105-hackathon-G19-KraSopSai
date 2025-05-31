import {Hono} from "hono";
import { VictimController } from "../controllers/victim.controller.ts";

export const VictimRouter = new Hono();

VictimRouter.get("/" , VictimController.getAllVictim);
VictimRouter.get("/UserId/:id" , VictimController.getVictimbyUserID);
VictimRouter.get("/getbyid/:id" , VictimController.getVictimbyID);

VictimRouter.post("/" , VictimController.createVictim);
VictimRouter.patch("/:id" , VictimController.EditVictim);
VictimRouter.delete("/:id" , VictimController.deleteVictim);