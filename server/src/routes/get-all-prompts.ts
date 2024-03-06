import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export const getAllPromptsRoute = async (app: FastifyInstance) => {
  app.get("/prompts", async (request, reply) => {
    // @ts-expect-error
    const userId = request.userID;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const prompts = await prisma.prompt.findMany();

    return prompts;
  });
};
