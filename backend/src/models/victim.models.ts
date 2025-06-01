import { error } from "console";
import type { Victim } from "../generated/prisma/index.js";
import { db } from "../index.ts";
import { use } from "hono/jsx";

type VictimType = {
    id : number,
    name : string,
    reason : string,
    hp : number,
    userId : number
}

type createVictim = {
    name : string,
    reason : string,
    hp : number,
    userId : number
}

export const VictimModel = {

  createVictim : async (victim : createVictim) => {
    console.log("victim", victim);

     try {
      
      const newVictim = await db.victim.create({
        data : {
            name : victim.name,
            reason : victim.reason,
            hp: 1,
            userId : victim.userId,
            //hp : victim.hp,
            //userId : victim.userId
        }
     });
     return newVictim;
    } 
    catch (error) {
      if (error === 'P2003') {
        throw new Error(
          "Invalid reference: One or more related records don't exist");
      }
      throw error;
    }
  },
  

  getAllVictim: async () => {
    return await db.victim.findMany();
  },
  
  getVictimByUserId: async (id: number) => {
    const Job = await db.victim.findMany({
        where: {
            userId: id,
        },
    });
    return Job;
  },

  getVictimById: async (id: number) => {
    const Job = await db.victim.findUnique({
        where: {
            id : id,
        },
    });
    return Job;
  },

updateVictim: async (id : number,victim : createVictim) => {
    try {
      const upvictim = await db.victim.update({
        where : {
            id : id
        },
        data : {
            name : victim.name,
            reason : victim.reason,
            hp : victim.hp,
            userId : victim.userId
        }
     });
     return upvictim;
    } 
    catch (error) {
      if (error === 'P2003') {
        throw new Error(
          "Invalid reference: One or more related records don't exist");
      }
      throw error;
    }
  },
  deleteVictim: async (id: number) => {
      const Job = await db.victim.delete({
        where: {
            id : id,
        },
    });
    return Job;
  },

};