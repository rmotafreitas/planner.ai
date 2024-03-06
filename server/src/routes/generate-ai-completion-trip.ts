import { FastifyInstance } from "fastify";
import { z } from "zod";
import { completion } from "./completion/gen/generate";

export const generateAICompletionRoute = async (app: FastifyInstance) => {
  app.post("/ai/complete", async (request, reply) => {
    // @ts-expect-error
    const userID = request.userID;
    if (!userID) {
      throw new Error("Not authenticated");
    }

    await completion(request, reply);
  });
};
