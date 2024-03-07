import { fastifyCors } from "@fastify/cors";
import fastifystatic from "@fastify/static";
import "dotenv/config";
import { FastifyReply, FastifyRequest, fastify } from "fastify";
import * as jose from "jose";
import cron from "node-cron";
import path from "path";
import { deleteAICompletionHistoryRoute } from "./routes/delete-ai-completion-log";
import { generateAICompletionRoute } from "./routes/generate-ai-completion-trip";
import { getAICompletionHistoryRoute } from "./routes/get-ai-completion-log";
import { getAILogsCompletion } from "./routes/get-ai-log";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { saveAITripCompletion } from "./routes/save-ai-completion";
import { uploadTripJSONRoute } from "./routes/upload-trip-json";
import { updateUser } from "./routes/user/update";
import { prisma } from "./lib/prisma";
import { sendNewsletter } from "./lib/utils";
const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;

const app = fastify();

const authJWTCHeaderHanko = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const token = request.headers.authorization?.split(" ")[1] ?? null;

  // Check if the token is valid and not expired
  try {
    const payload = jose.decodeJwt(token ?? "");
    const userID = payload.sub;

    if (!userID || token === undefined) {
      throw new Error("Invalid token");
    }

    // @ts-expect-error
    request.userID = userID;
  } catch (error) {
    // @ts-expect-error
    request.userID = null;
  }
};

app.register(fastifyCors, {
  origin: "http://localhost:5173",
});

app.addHook("preHandler", authJWTCHeaderHanko);

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

app.register(getAllPromptsRoute);
app.register(saveAITripCompletion);
app.register(getAILogsCompletion);
app.register(getAICompletionHistoryRoute);
app.register(deleteAICompletionHistoryRoute);
app.register(uploadTripJSONRoute);
app.register(generateAICompletionRoute);
app.register(updateUser);

app.register(fastifystatic, {
  root: path.join(__dirname, "..", "tmp"),
  prefix: "/tmp/",
});

// @ts-ignore
app
  .listen({
    host,
    port: Number(process.env.PORT) || 3000,
  })
  .then((address) => {
    console.log(`Server is listening on ${address}`);
    cron.schedule(
      "0 */1 * * *", // Every 1 hour
      async () => {
        const allUsers = await prisma.user.findMany();
        for (const user of allUsers) {
          const wishList = user.wishList
            .split(",")
            .filter((x) => x !== "" && x !== user.itaCode);
          console.log(wishList);
          if (
            wishList.length > 0 &&
            user.email &&
            user.subscribedToNewsletter &&
            user.itaCode
          ) {
            sendNewsletter({
              email: user.email,
              wishList,
              originCode: user.itaCode,
            });
          }
        }
      },
      {
        scheduled: true,
        timezone: "Europe/Lisbon", // Set the appropriate time zone
      }
    );
  });
