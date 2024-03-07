import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const deleteAICompletionHistoryRoute = async (app: FastifyInstance) => {
  app.delete("/ai/complete/:id", async (request, reply) => {
    // @ts-expect-error
    const userId = request.userID;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);

    const tripId = (
      await prisma.log.findUnique({
        where: {
          id,
        },
      })
    )?.tripId;

    await prisma.log.delete({
      where: {
        id,
      },
    });

    if (tripId) {
      await prisma.trip.delete({
        where: {
          id: tripId,
        },
      });
    }
  });
};
