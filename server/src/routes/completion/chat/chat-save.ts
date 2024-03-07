import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

export const getAIChatSaveRoute = async (app: FastifyInstance) => {
  app.post("/ai/chat/:type/save", async (request, reply) => {
    // @ts-expect-error
    const userId = request.userID;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const bodySchema = z.object({
      contentId: z.string(),
      promptText: z.string(),
      resultText: z.string(),
    });

    const { contentId, promptText, resultText } = bodySchema.parse(
      request.body
    );

    await prisma.message.create({
      data: {
        userId,
        promptText,
        resultText,
        logId: contentId,
      },
    });
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
