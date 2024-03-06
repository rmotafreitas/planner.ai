import { OpenAIStream } from "ai";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

import { openai, streamRes } from "../../../lib/opeanai";

export async function completion(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    id: z.string(),
    prompt: z.string(),
    temperature: z.number().min(0).max(1).default(0.5),
  });

  const { id, prompt, temperature } = bodySchema.parse(request.body);

  const trip = await prisma.trip.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (!trip /* || !trip?.*/) {
    return reply.status(400).send({ error: "Trip not found" });
  }

  const promptMessage = prompt.replace("{trip}", "");

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k-0613",
    temperature,
    messages: [
      {
        role: "user",
        content: promptMessage,
      },
    ],
    max_tokens: 400,
    stream: true,
  });

  const stream = OpenAIStream(response);

  return streamRes(stream, reply);
}
