import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

import { openai } from "../../../lib/opeanai";

export async function completion(request: FastifyRequest, reply: FastifyReply) {
  let promptData = await prisma.prompt.findFirst();
  let promptDefault: string =
    promptData?.template ||
    `
      Your role is to generate a detailed itinerary for the trip, taking into account arrival and departure times:
- OBJCET {
	Short introduction to the destination
	- STRING
	
	Provide a list of sights and attractions in the destination city, based on the geographical coordinates provided, including descriptions. If there is no information in TRIP about this, you can add it yourself
	- pointsOfInterest: ARRAY[OBJCET {
		LOCATION: STRING,
		DESCRIPTION: STRING,
		ADDITIONAL_MONEY: NUMBER,
	}]

	Give suggestions on the best accommodation options in the destination city, taking into account price preferences, and information already obtained and new. If there is no information on TRIP about this, you can add it yourself
	- hostingStay: ARRAY[OBJCET {
		LOCATION: STRING,
		DESCRIPTION: STRING,
		MONEY: NUMBER,
	}]

Offer information about the local culture and ETIQUETTE of the destination country, TRADITIONS, COMPLIANCES, what is typically EAT/typical foods, SURVIVAL LANGUAGE, SURVIVAL LANGUAGE includes greetings phrases, goodbye phrases, some weather phrases, excesume me phrases/expressions
	- OBJECT {
		ETIQUETTE: ARRAY[STRING],
		GREETINGS: ARRAY[STRING],
		FOOD: ARRAY[STRING],
		LANGUAGE: ARRAY[OBJCET {
			IN_LOCAL_LANGUAGE: STRING
			PRONUNCIATION: STRING
		}]
	}
	

	Provide useful travel tips, such as public transportation available in the city, safety precautions and money-saving tips.
	- TIPS: OBJECT {
		TRAVEL_RELATED: STRING
		ECONOMY_RELATED: STRING
	}

	With the existing temperature data, say things like, is it important to use an umbrella?
	- WEATHER_TEXT: STRING
}

Return ONLY a json object in list format as in the example below, if there no information in certain keys, create it up yoursef, dont leave any empty string neither empty arrays, dont put [], craft/create the information yourself if needed:
'''
{
     "introductionText": FILL,
     "pointsOfInterest": FILL,
      "hostingStay": FILL,
      "usefulInformations": FILL,
      "tips": FILL,
      "weatherText": FILL
}
'''

Trip:
'''
{JSON}
'''`;

  const bodySchema = z.object({
    tripId: z.string(),
    prompt: z.string().default(promptDefault),
    temperature: z.number().min(0).max(1).default(0.5),
  });

  const { tripId, prompt, temperature } = bodySchema.parse(request.body);

  const trip = await prisma.trip.findUniqueOrThrow({
    where: {
      id: tripId,
    },
  });

  if (!trip || !trip?.JSON) {
    return reply.status(400).send({ error: "Trip not found" });
  }

  const promptMessage = prompt.toUpperCase().includes("JSON")
    ? prompt.replace("{JSON}", trip.JSON)
    : prompt + "\n With this trip: " + trip.JSON;

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
    stream: false,
  });

  const message = response.choices[0].message.content;

  const log = await prisma.log.create({
    data: {
      userId: trip.userId,
      tripId: trip.id,
      resultText: message,
      promptText: prompt,
      messages: {
        create: [
          {
            userId: trip.userId,
            promptText: prompt,
            resultText: message,
          },
        ],
      },
    },
  });

  return reply.send({ message });
}
