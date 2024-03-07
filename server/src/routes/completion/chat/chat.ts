import { prisma } from "../../../lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export const getAIChatRoute = async (app: FastifyInstance) => {
  app.post("/ai/chat", async (request, reply) => {
    // @ts-expect-error
    const userId = request.userID;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const bodySchema = z.object({
      contentId: z.string(),
    });

    const { contentId } = bodySchema.parse(request.body);

    const messages = await prisma.message.findMany({
      where: {
        userId,
        logId: contentId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  });
};
