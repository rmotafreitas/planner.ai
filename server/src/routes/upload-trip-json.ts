import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const uploadTripJSONRoute = async (app: FastifyInstance) => {
  app.post("/trip", async (request, reply) => {
    // @ts-expect-error
    const userId = request.userID;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const bodySchema = z.object({
      startLocationITACode: z.string(),
      endLocationITACode: z.string(),
      JSON: z.string(),
    });

    const { startLocationITACode, endLocationITACode, JSON } = bodySchema.parse(
      request.body
    );

    if (!startLocationITACode || !endLocationITACode || !JSON) {
      return reply.status(400).send({ error: "No trip uploaded" });
    }

    const trip = await prisma.trip.create({
      data: {
        JSON,
        startLocationITACode,
        endLocationITACode,
        userId,
      },
    });

    return reply.send({ trip });
  });
};
