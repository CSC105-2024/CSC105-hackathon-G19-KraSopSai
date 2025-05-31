import { db } from "../index.ts";

export const JobModel = {
  getAll: () => db.hitEffect.findMany(),
  getById: (id: number) => db.hitEffect.findUnique({ where: { id } }),
  create: (data: { title: string; description: string }) => db.hitEffect.create({ data }),
  delete: (id: number) => db.hitEffect.delete({ where: { id } }),
};
