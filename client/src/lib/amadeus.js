import axios from "axios";

const getToken = async () => {
  const clientId = import.meta.env.VITE_API_AMADEUS_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_API_AMADEUS_CLIENT_SECRET;
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
  const data = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Erro ao obter token:", error);
    return null;
  }
};

const extractImportantDataFromAFlight = (flight) => {
  return {
    origem: flight.itineraries[0].segments[0].departure.iataCode,
    destino:
      flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1]
        .arrival.iataCode,
    duracaoTotal: flight.itineraries[0].duration,
    horarioPartida: flight.itineraries[0].segments[0].departure.at,
    horarioChegada:
      flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1]
        .arrival.at,
    numeroVoo: `${flight.itineraries[0].segments[0].carrierCode}${flight.itineraries[0].segments[0].number} / ${flight.itineraries[0].segments[1].carrierCode}${flight.itineraries[0].segments[1].number}`,
    precoTotal: `${flight.price.total} ${flight.price.currency}`,
    tipoTarifa: flight.travelerPricings[0].fareOption,
    tipoViajante: flight.travelerPricings[0].travelerType,
    politicaBagagem: `Inclui ${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} malas de porão`,
    amenities:
      flight.travelerPricings[0].fareDetailsBySegment[0].amenities.map(
        (amenity) => amenity.description
      ) || [],
  };
};

const getFlights = async ({ origin, destination, date, adults, max }) => {
  const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=${adults}&max=${max}`;
  const accessToken = await getToken();

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};

export { getToken, extractImportantDataFromAFlight, getFlights };
