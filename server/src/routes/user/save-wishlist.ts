import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export const saveWishList = async (app: FastifyInstance) => {
  app.post("/user/wishlist", async (request, reply) => {
    // @ts-expect-error
    const userId = request.userID;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const bodySchema = z.object({
      wishList: z.string().nonempty(),
      email: z.string().email().nonempty(),
    });

    const { wishList, email } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          id: userId as string,
          wishList,
          email,
        },
      });
      return newUser;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wishList,
      },
    });

    return updatedUser;
  });
};
