import { scrapeData } from "./amadeus";
import { postTrip } from "./myapi";

const handleExplore = async ({ origin, destination, date, adults, max }) => {
  console.log("handleExplore", { origin, destination, date, adults, max });
  const data = await scrapeData({ origin, destination, date, adults, max });
  await postTrip(data);
  return data;
};

export { handleExplore };
