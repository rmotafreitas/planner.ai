import { FastifyInstance } from "fastify";
import { prisma } from "./../lib/prisma";

export const getAILogsCompletion = async (app: FastifyInstance) => {
  app.post("/ai/complete/log", async (request, reply) => {
    // @ts-expect-error
    const userId = request.userID;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const log = await prisma.log.findMany();

    return log;
  });
};