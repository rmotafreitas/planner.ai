import { scrapeData } from "./amadeus";
import { postTrip } from "./myapi";

const handleExplore = async ({ origin, destination, date, adults, max }) => {
  console.log("handleExplore", { origin, destination, date, adults, max });
  const data = await scrapeData({ origin, destination, date, adults, max });
  const res = await postTrip(data);
  if (res.log.resultText) {
    console.log("Trip posted: ", res);
    return res;
  } else {
    return false;
  }
};

export { handleExplore };
