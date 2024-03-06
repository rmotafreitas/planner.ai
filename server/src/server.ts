import "dotenv/config";
import { fastifyCors } from "@fastify/cors";
import { FastifyReply, FastifyRequest, fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import fastifystatic from "@fastify/static";
import path from "path";
import { saveAIVideoCompletion } from "./routes/save-ai-completion";
import { getAILogsCompletion } from "./routes/get-ai-log";
import * as jose from "jose";
import { getAICompletionHistoryRoute } from "./routes/get-ai-completion-log";
import { deleteAICompletionHistoryRoute } from "./routes/delete-ai-completion-log";
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
app.register(saveAIVideoCompletion);
app.register(getAILogsCompletion);
app.register(getAICompletionHistoryRoute);
app.register(deleteAICompletionHistoryRoute);

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
  });
