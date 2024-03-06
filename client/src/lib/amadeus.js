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

// ============== FUNCTIONS THAT TAKE CARE OF THE FLIGHTS ==============
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
    numeroVoo: `${flight.itineraries[0].segments[0].carrierCode}${
      flight.itineraries[0].segments[0].number
    } / ${
      flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1]
        .carrierCode
    }${
      flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1]
        .number
    }`,
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
    console.log("Response:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};

// ============== FUNCTIONS THAT TAKE CARE OF THE HOTELS ==============
const getHotels = async ({ cityCode }) => {
  const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`;
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

const extractHotelsIds = (hotels) => {
  return hotels.map((hotel) => hotel.hotelId);
};

const getHotelDeals = async ({ hotelIds, adults }) => {
  const url = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds.join(
    ","
  )}&adults=${adults}&roomQuantity=1`;
  const accessToken = await getToken();

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    return [];
  }
};

const joinHotelAndHotelDeals = (hotels, hotelDeals) => {
  return hotels
    .map((hotel) => {
      let deals = [];
      hotelDeals.forEach((deal) => {
        if (
          deal.hotel.hotelId === hotel.hotelId &&
          deal.offers.length > 0 &&
          deal.available
        ) {
          deals.push(deal);
        }
      });
      deals = deals.map((deal) => {
        const bestOffer = deal.offers.reduce((best, current) => {
          if (parseFloat(current.price.total) < parseFloat(best.price.total)) {
            return current;
          }
          return best;
        });

        return {
          id: bestOffer.id,
          checkInDate: bestOffer.checkInDate,
          checkOutDate: bestOffer.checkOutDate,
          roomType: bestOffer.room.type,
          bedType: bestOffer.room.typeEstimated.bedType,
          priceTotal: `${bestOffer.price.total} ${bestOffer.price.currency}`,
          cancellationDeadline:
            bestOffer.policies.cancellations[0].deadline || "",
          cancellationAmount: `${
            bestOffer.policies.cancellations[0].amount || ""
          } ${bestOffer.price.currency}`,
        };
      });
      return {
        ...hotel,
        deals,
      };
    })
    .filter((hotel) => hotel.deals.length > 0);
};

const getHotelsWithDeals = async ({ cityCode, adults, checkInDate, max }) => {
  const hotels = (await getHotels({ cityCode })).slice(0, max);
  const hotelIds = extractHotelsIds(hotels);
  const hotelDeals = await getHotelDeals({ hotelIds, adults, checkInDate });

  return joinHotelAndHotelDeals(hotels, hotelDeals);
};

export { extractImportantDataFromAFlight, getFlights, getHotelsWithDeals };
