import { db } from "../index.ts";
import type { CreateVictimInput } from "../types/type.ts";

export const VictimModel = {

  createVictim: async (victim: CreateVictimInput) => {
    try {
      const newVictim = await db.victim.create({
        data: {
          name: victim.name,
          reason: victim.reason,
          hp: victim.hp,
          userId: victim.userId,
        },
      });
      return newVictim;
    } catch (error: unknown) {
      if (error instanceof Error && (error as { code?: string }).code === 'P2003') {
        throw new Error("Invalid reference: One or more related records don't exist");
      }
      throw error;
    }
  },

  getAllVictim: async () => {
    return await db.victim.findMany();
  },

  getVictimByUserId: async (id: number) => {
    return await db.victim.findMany({
      where: { userId: id },
    });
  },

  getVictimById: async (id: number) => {
    return await db.victim.findUnique({
      where: { id },
    });
  },

  updateVictim: async (id: number, victim: CreateVictimInput) => {
    try {
      const upvictim = await db.victim.update({
        where: { id },
        data: {
          name: victim.name,
          reason: victim.reason,
          hp: victim.hp,
          userId: victim.userId,
        },
      });
      return upvictim;
    } catch (error: unknown) {
      if (error instanceof Error && (error as { code?: string }).code === 'P2003') {
        throw new Error("Invalid reference: One or more related records don't exist");
      }
      throw error;
    }
  },

  deleteVictim: async (id: number) => {
    return await db.victim.delete({
      where: { id },
    });
  },

};
