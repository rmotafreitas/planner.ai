import { scrapeData } from "./amadeus";

const handleExplore = async ({ origin, destination, date, adults, max }) => {
  console.log("handleExplore", { origin, destination, date, adults, max });
  const data = await scrapeData({ origin, destination, date, adults, max });
  console.log(data);
  return data;
};

export { handleExplore };
