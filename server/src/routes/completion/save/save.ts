import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

export async function completionSave(
  request: FastifyRequest,
  reply: FastifyReply,
  userId: string
) {
  const bodySchema = z.object({
    id: z.string(),
    resultText: z.string(),
    promptText: z.string(),
  });

  const { id, resultText, promptText } = bodySchema.parse(request.body);

  const article = await prisma.log.findFirst({
    where: {
      id,
      userId,
      resultText,
    },
  });

  if (!article) {
    const res = await prisma.log.create({
      data: {
        userId,
        id,
        resultText,
        promptText,
        messages: {
          create: [
            {
              userId,
              promptText,
              resultText,
            },
          ],
        },
      },
    });
    return res;
  }
  return;
}
