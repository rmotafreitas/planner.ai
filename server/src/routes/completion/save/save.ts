import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

export async function completionSave(
  request: FastifyRequest,
  reply: FastifyReply,
  userId: string
) {
  const bodySchema = z.object({
    tripId: z.string(),
    resultText: z.string(),
    promptText: z.string(),
  });

  const { tripId, resultText, promptText } = bodySchema.parse(request.body);

  const trip = await prisma.log.findFirst({
    where: {
      tripId,
      userId,
      resultText,
    },
  });

  if (!trip) {
    const res = await prisma.log.create({
      data: {
        userId,
        tripId,
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
