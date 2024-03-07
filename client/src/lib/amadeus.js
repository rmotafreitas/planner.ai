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
const createArrayWithImportantDataFromFlights = (flights) => {
  return flights.map(extractImportantDataFromAFlight);
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
      flight?.travelerPricings[0]?.fareDetailsBySegment[0]?.amenities?.map(
        (amenity) => amenity?.description
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

// ============== FUNCTIONS THAT TAKE CARE OF THE WEATHER AND LOCATION ==============
const getWeather = async ({ destination, date }) => {
  const apiKey = import.meta.env.VITE_API_WEATHER_API_KEY;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${destination}&days=${14}&aqi=no&alerts=no&dt=${date}lang=pt`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter previsão do tempo:", error);
    return null;
  }
};

const extractImportantInformationFromWeather = (temp) => {
  return {
    currentWeather: {
      condition: temp.current.condition.text,
      conditionIcon: temp.current.condition.icon,
      tempCelsius: temp.current.temp_c,
      tempFahrenheit: temp.current.temp_f,
      humidity: temp.current.humidity,
      windSpeedMph: temp.current.wind_mph,
      windSpeedKph: temp.current.wind_kph,
    },
    forecast: temp.forecast.forecastday.map((day) => ({
      date: day.date,
      maxTempCelsius: day.day.maxtemp_c,
      minTempCelsius: day.day.mintemp_c,
      condition: day.day.condition.text,
    })),
    astro: {
      sunrise: temp.forecast.forecastday[0].astro.sunrise,
      sunset: temp.forecast.forecastday[0].astro.sunset,
      moonrise: temp.forecast.forecastday[0].astro.moonrise,
      moonset: temp.forecast.forecastday[0].astro.moonset,
      moonPhase: temp.forecast.forecastday[0].astro.moon_phase,
    },
  };
};

const extractLocationFromWeather = (weather) => {
  return {
    region: weather.location.region,
    country: weather.location.country,
    latitude: weather.location.lat,
    longitude: weather.location.lon,
    tzId: weather.location.tz_id,
  };
};

// ============== FUNCTIONS THAT TAKE CARE OF POINTS OF INTEREST ==============
const getPointsOfInterest = async ({ latitude, longitude }) => {
  const url = `https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${latitude}&longitude=${longitude}`;

  const accessToken = await getToken();

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Erro ao obter pontos de interesse:", error);
    return null;
  }
};

const extractImportantDataFromAPointOfInterest = (poi) => {
  return {
    name: poi.name,
    type: poi.type,
    subType: poi.subType,
    category: poi.category,
    tags: poi.tags,
  };
};

const extractImportantDataFromPointsOfInterest = (pois) => {
  return pois.map(extractImportantDataFromAPointOfInterest);
};

// ============== PHOTO FUNCTION ==============

const getPhoto = async (location) => {
  const encodedCityName = encodeURIComponent(location); // Codificar o nome da cidade para URL
  const accessKey = import.meta.env.VITE_API_UNSPLASH_ACCESS_KEY;
  const url = `https://api.unsplash.com/photos/random?query=${encodedCityName}&client_id=${accessKey}&orientation=landscape`;
  try {
    const response = await axios.get(url);
    return response.data.urls.regular;
  } catch (error) {
    console.error("Erro ao obter foto:", error);
    return null;
  }
};

// ============== MAIN FUNCTION ==============
const scrapeData = async ({
  origin,
  destination,
  date,
  adults,
  max,
  setStatus,
}) => {
  setStatus("flights");
  let flights = await getFlights({
    origin,
    destination,
    date,
    adults,
    max,
  });
  flights = createArrayWithImportantDataFromFlights(flights);
  setStatus("hotels");
  let hotels = await getHotelsWithDeals({
    cityCode: destination,
    adults,
    max,
  });
  setStatus("weather");
  let weather = await getWeather({ destination, date });
  setStatus("activities");
  const destinationData = extractLocationFromWeather(weather);
  weather = extractImportantInformationFromWeather(weather);
  let pointsOfInterest =
    (await getPointsOfInterest({
      latitude: destinationData.latitude,
      longitude: destinationData.longitude,
    })) || [];
  pointsOfInterest = extractImportantDataFromPointsOfInterest(pointsOfInterest);
  setStatus("photo");
  const photo = await getPhoto(destinationData.region);
  const data = {
    originITACode: origin,
    destinationITACode: destination,
    date,
    adults,
    flights,
    hotels,
    weather,
    destination: destinationData,
    pointsOfInterest,
    photo,
  };
  return data;
};

export {
  extractImportantDataFromAFlight,
  getFlights,
  getHotelsWithDeals,
  getWeather,
  extractImportantInformationFromWeather,
  extractLocationFromWeather,
  getPointsOfInterest,
  extractImportantDataFromPointsOfInterest,
  scrapeData,
  getPhoto,
};
