import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const getAICompletionHistoryRoute = async (app: FastifyInstance) => {
  app.get("/ai/complete/:id", async (request, reply) => {
    // @ts-expect-error
    const userId = request.userID;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);

    return await prisma.log.findUnique({
      where: {
        id,
      },
    });
  });
};
