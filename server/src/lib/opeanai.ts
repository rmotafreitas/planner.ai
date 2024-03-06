import { OpenAI } from "openai";
import "dotenv/config";
import { streamToResponse } from "ai";
import { FastifyReply } from "fastify";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const streamRes = (stream: ReadableStream<any>, reply: FastifyReply) => {
  return streamToResponse(stream, reply.raw, {
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET, POST",
    },
  });
};
