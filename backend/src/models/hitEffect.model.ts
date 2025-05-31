import type { Context } from "hono";
import { db } from "../index.ts";

type HitEffect = {
  id: number;
  title: string;
  victimId: number;
};

export const createHitEffect = async (
  data: {
    title: string;
    victimId: number;
  }
) => {
  const newHitEffect = await db.hitEffect.create({
    data: {
      
      title: data.title,
      victimId: data.victimId,
    },
  });
  return newHitEffect;
};

export const getAllHitEffects = async () => {
  const allHitEffect = await db.hitEffect.findMany();
  return allHitEffect;
};

export const getHitEffectById = async (id: number) => {
  const hitEffectId = await db.hitEffect.findUnique({
    where: {
      id: id,
    },
  });
  return hitEffectId;
};

export const update = async (id: number, data: { title: string; victimId: number }) => {
  const editHitEffect = await db.hitEffect.update({
    where: { id },
    data: {
      title: data.title,
      victimId: data.victimId,
    },
  });
  return editHitEffect; 
};

export const deleteHitEffect = async (id: number) => {
  const delHitEffect = await db.hitEffect.delete({
    where: { id },
  });
  return delHitEffect;
};