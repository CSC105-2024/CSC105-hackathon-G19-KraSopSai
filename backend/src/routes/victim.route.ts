import {Hono} from "hono";
import { VictimController } from "../controllers/victim.controller.ts";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

// import * as VictimController from "../controllers/victim.controller.js";


const VictimRouter = new Hono();

VictimRouter.get("/" , VictimController.getAllVictim);
VictimRouter.get("/UserId/:id" , VictimController.getVictimbyUserID);
VictimRouter.get("/getbyid/:id" , VictimController.getVictimbyID);

VictimRouter.post("/" , authMiddleware, VictimController.createVictim);
// VictimRouter.post("/" , (c: Context) => {console.log("hello world")});
VictimRouter.patch("/:id" , VictimController.EditVictim);
VictimRouter.delete("/:id" , VictimController.deleteVictim);

export default VictimRouter