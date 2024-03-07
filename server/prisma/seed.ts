import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.prompt.deleteMany();

  await prisma.prompt.create({
    data: {
      title: "DOCUMENT",
      template: `
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
'''`.trim(),
    },
  });

  await prisma.prompt.create({
    data: {
      title: "NEWSLETTER",
      template: `
	  Your task is to generate data for a daily newsletter to be sent to subscribers that are planning to make a trip.

- Weather forecast for the destination city. STRING: With the existing temperature data, say things like, is it important to use an umbrella? 
- Travel tips for the destination. SMALL TEXT STRING WITH JUST SOME COSTUMES/CULTURAL/LOCALS INFORMATIONS
- Flights information for the destination. ARRAY[
												OBJCET: {
													TIME_DEPART,
													TIME_ARRIVAL,
													PRICE
												}
											]

Return ONLY a json object in this format as in the example below, if there no information in certain keys, create it up yoursef, dont leave any empty string neither empty arrays, dont put [], craft/create the information yourself if needed:
'''
{
     "tipsText": FILL,
     "weatherText": FILL,
	 "flightsList": FILL
}
'''

Trip:
'''
{JSON}
'''`.trim(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
