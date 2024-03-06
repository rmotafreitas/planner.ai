import { getFlights, extractImportantDataFromAFlight } from "./amadeus";

const handleExplore = async () => {
  const tomorrowQuery = new Date();
  tomorrowQuery.setDate(tomorrowQuery.getDate() + 1);
  const tomorrow = tomorrowQuery.toISOString().split("T")[0];
  console.log("Explorando voos para amanhã:", tomorrow);
  const flights = await getFlights({
    origin: "OPO",
    destination: "HND",
    date: tomorrow,
    adults: 1,
    max: 5,
  });
  console.log("Voos encontrados:");
  for (const flight of flights) {
    console.log(extractImportantDataFromAFlight(flight));
  }
};

export { handleExplore };
