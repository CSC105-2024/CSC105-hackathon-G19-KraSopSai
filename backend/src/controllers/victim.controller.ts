import type {Context} from "hono";
import { VictimModel } from "../models/victim.models.ts"; 

type VictimType = {
    id : number,
     name : string,
    hp : number,
    userId : number
}

type createVictim = {
   name : string,
    hp : number,
    userId : number
}

export const VictimController = {
    createVictim : async (c: Context) => {
        try {
        const body = await c.req.json();
		if (!body) {
			return c.json({
				success: false,
				data: null,
				msg: 'Missing Required Field',
			});
		}
      
		const newVictim = await VictimModel.createVictim(body);
		return c.json({
			success: true,
			data: newVictim,
			msg: 'Successfully created new Job',
		});
        } catch (e) {
        return c.json(
            {
            success: false,
            data: null,
            msg: `Internal Server Error : ${e}`,
            },
            500
        );
        }
    },
    getAllVictim : async (c: Context) => {
        try {
		const Victim = await VictimModel.getAllVictim();
		return c.json({
			success: true,
			data: Victim,
			msg: 'All enemy',
		});
        } catch (e) {
        return c.json(
            {
            success: false,
            data: null,
            msg: `Internal Server Error : ${e}`,
            },
            500
        );
        }
    },

    getVictimbyUserID: async (c: Context) => {
        try {
        const id = await c.req.param('id')
        if (!id) {
            return c.json({ error: "ID is null" }, 404);
          }
          const getVictim = await VictimModel.getVictimByUserId(Number(id));
            return c.json({
                success: true,
                data:getVictim,
                msg: "Victim of user",
            });
        } catch (e) {
        return c.json(
            {
            success: false,
            data: null,
            msg: `Internal Server Error : ${e}`,
            },
            500
        );
        }
    },

    getVictimbyID: async (c: Context) => {
        try {
        const id = await c.req.param('id')
        if (!id) {
            return c.json({ error: "ID is null" }, 404);
          }
          const getVictim = await VictimModel.getVictimById(Number(id));
            return c.json({
                success: true,
                data:getVictim,
                msg: "Victim by id",
            });
        } catch (e) {
        return c.json(
            {
            success: false,
            data: null,
            msg: `Internal Server Error : ${e}`,
            },
            500
        );
        }
    },


    EditVictim: async (c:Context) =>{
        try {
        const id = await c.req.param('id')
        const body = await c.req.json();
        if (!id || !body ) {
            return c.json({ error: "missing data" }, 404);
        }
          const upVictim = await VictimModel.updateVictim(Number(id),body);
            return c.json({
                success: true,
                data: upVictim,
                msg: "Edit Victim!",
            });
        } catch (e) {
        return c.json(
            {
            success: false,
            data: null,
            msg: `Internal Server Error : ${e}`,
            },
            500
        );
        }
    },
    deleteVictim: async (c:Context) =>{
        try {
        const id = await c.req.param('id')
        
        if (!id) {
            return c.json({ error: "missing data" }, 404);
        }
          const getVictim = await VictimModel.deleteVictim(Number(id));
            return c.json({
                success: true,
                data: getVictim,
                msg: "delete Victim",
            });
        } catch (e) {
        return c.json(
            {
            success: false,
            data: null,
            msg: `Internal Server Error : ${e}`,
            },
            500
        );
        }
    },
}