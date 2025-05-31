import { db } from "../index.ts";

export const JobModel = {
  getAll: () => db.hitEffect.findMany(),

  getById: (id: number) =>
    db.hitEffect.findUnique({
      where: { id },
    }),

  create: (data: { title: string; victimId: number }) =>
    db.hitEffect.create({
      data: {
        title: data.title,
        victim: {
          connect: { id: data.victimId },
        },
      },
    }),

  delete: (id: number) =>
    db.hitEffect.delete({
      where: { id },
    }),
};
