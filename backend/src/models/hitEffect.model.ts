// import type { Context } from "hono";
// import { db } from "../index.ts";

// type HitEffect = {
//   id: number; 
//   title: string;
//   victimId: number;
// };
// export const getAllHitEffects = async() => {
//   const allHitEffect = await db.hitEffect.findMany();
//   return allHitEffect;
// }
// export const getOneHitEffect = async() => {
//   const oneHitEffect = await db.hitEffect.findUnique({

//   });
//   return allHitEffect;
// }
// export const createHitEffect = async (
//   data: { 
//     title: string; 
//     victimId: number 
//   }) => {
//     const newHitEffect = await db.hitEffect.create({
//       data: {
//         title: data.title,
//         victim: {
//           connect: { id: data.victimId },
//         },
//       },
//     });
//     return newHitEffect;
//   }
  
  
// export const update = (id: number, data: { title?: string; victimId?: number }) =>
//   db.hitEffect.update({
//     where: { id },
//     data: {
//       title: data.title,
//       victim: data.victimId ? { connect: { id: data.victimId } } : undefined,
//     },
//   });

// export const del = (id: number) =>
//   db.hitEffect.delete({
//     where: { id },
//   });
