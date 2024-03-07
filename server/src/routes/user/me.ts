import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export const userInfo = async (app: FastifyInstance) => {
  app.post("/user/me", async (request, reply) => {
    // @ts-expect-error
    const userId = request.userID;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const bodySchema = z.object({
      email: z.string().email().optional(),
    });

    const { email } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      if (!email) {
        throw new Error("Email is required");
      }
      const newUser = await prisma.user.create({
        data: {
          id: userId as string,
          email,
          wishList: "",
        },
      });
      return newUser;
    }

    return user;
  });
};
