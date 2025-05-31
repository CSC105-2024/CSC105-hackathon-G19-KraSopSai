// import * as hitEffectModel from "../models/hitEffect.model.ts";
// import type { Context } from "hono";

// export const getAll = async (c: Context) => {
//   const hitEffect = await hitEffectModel.getAll();
//   return c.json({
//     success: true,
//     msg: "Successfully Get all hitEffect",
//     data: hitEffect,
//   });
// };

// export const getById = async (c: Context) => {
//   const id = Number(c.req.param("id"));
//   const hitEffect = await hitEffectModel.getById(id);
//   if (!hitEffect)
//     return c.json(
//       {
//         success: false,
//         msg: "Job not found",
//         data: null,
//       },
//       404
//     );
//   return c.json(
//     {
//       success: true,
//       msg: "Successfully Get hitEffect",
//       data: hitEffect,
//     },
//     200
//   );
// };

// export const createHitEffect = async (c: Context) => {
//   try {
//     const body = await c.req.json();
//     if (!body.title || !body.victimId) {
//       return c.json({
//           success: false,
//           msg: "Missing title and victimId",
//           data: null,
//         },
//         400
//       );  
//     const newhitEffect = await hitEffectModel.create(body);
//     return c.json({
//       success: true,
//       msg: "hitEffect created successfully",
//       data: hitEffect,
//     });
//   } catch (error) {
//     return c.json(
//       {
//         success: false,
//         msg: "Error creating hitEffect",
//         data: null,
//       },
//       400
//     );
//   }
// };

// export const update = async (c: Context) => {
//   const id = Number(c.req.param("id"));
//   const body = await c.req.json();
//   const updatedHitEffect = await hitEffectModel.update(id, body);
//   if (!updatedHitEffect)
//     return c.json(
//       {
//         success: false,
//         msg: "hitEffect not found",
//         data: null,
//       },
//       404
//     );
//   return c.json({
//     success: true,
//     msg: "hitEffect updated successfully",
//     data: updatedHitEffect,
//   });
// };

// export const del = async (c: Context) => {
//   const id = Number(c.req.param("id"));
//   try {
//     await hitEffectModel.del(id);
//     return c.json({
//       success: true,
//       msg: "hitEffect deleted successfully",
//       data: null,
//     });
//   } catch (e) {
//     return c.json(
//       {
//         success: false,
//         msg: "hitEffect not found",
//         data: null,
//       },
//       404
//     );
//   }
// };
