import { scrapeData } from "./amadeus";
import { postTrip } from "./myapi";

const handleExplore = async ({
  origin,
  destination,
  date,
  adults,
  max,
  maxPrice,
  setStatus,
}) => {
  console.log("handleExplore", { origin, destination, date, adults, max });
  const data = await scrapeData({
    origin,
    destination,
    date,
    adults,
    max,
    setStatus,
  });
  for (const flight of data.flights) {
    if (flight.price > maxPrice) {
      data.flights = data.flights.filter((f) => f !== flight);
    }
  }
  if (data.flights.length === 0) {
    return false;
  }
  setStatus("gpt");
  const res = await postTrip(data);
  if (res.log.resultText) {
    console.log("Trip posted: ", res);
    return res;
  } else {
    return false;
  }
};

export { handleExplore };
