import {
  getFlights,
  extractImportantDataFromAFlight,
  getHotelsWithDeals,
} from "./amadeus";

const createArrayWithImportantDataFromFlights = (flights) => {
  return flights.map(extractImportantDataFromAFlight);
};

const handleExplore = async ({ origin, destination, date, adults, max }) => {
  console.log("Explorando voos para amanhã:", date);
  let flights = await getFlights({
    origin,
    destination,
    date,
    adults,
    max,
  });
  console.log("Voos encontrados:");
  flights = createArrayWithImportantDataFromFlights(flights);
  for (const flight of flights) {
    console.log(flight);
  }
  console.log("Fim dos voos encontrados.");
  console.log("Exploração de hotéis para amanhã:", date);
  console.log("Hotéis encontrados:");
  let hotels = await getHotelsWithDeals({
    cityCode: destination,
    adults,
    max,
  });
  for (const hotel of hotels) {
    console.log(hotel);
  }
  console.log("Fim dos hotéis encontrados.");
};

export { handleExplore };
