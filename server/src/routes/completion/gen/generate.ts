import { OpenAIStream } from "ai";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

import { openai, streamRes } from "../../../lib/opeanai";

export async function completion(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    tripId: z.string(),
    // prompt: z.string(),
    temperature: z.number().min(0).max(1).default(0.5),
  });

  const { tripId, /* prompt, */ temperature } = bodySchema.parse(request.body);
  let promptData = await prisma.prompt.findFirst();
  let prompt: string = "";

  if (!promptData) {
    return reply.status(400).send({ error: "Prompt not found" });
  } else {
    prompt = promptData.template;
  }

  const trip = await prisma.trip.findUniqueOrThrow({
    where: {
      id: tripId,
    },
  });

  if (!trip || !trip?.JSON) {
    return reply.status(400).send({ error: "Trip not found" });
  }

  const promptMessage = prompt.replace("{JSON}", trip.JSON);

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
