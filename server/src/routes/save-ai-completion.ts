import { FastifyInstance } from "fastify";
import { completionSave } from "./completion/save/save";

export const saveAITripCompletion = async (app: FastifyInstance) => {
  app.post("/ai/complete/save", async (request, reply) => {
    // @ts-expect-error
    const userId = request.userID;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await completionSave(request, reply, userId);
  });
};
