import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: `Bearer ${Cookies.get("hanko")}`,
  },
});

const postTrip = async (trip) => {
  console.log("Trying to post trip: ", trip);
  let res = await api.post("/trips", {
    startLocationITACode: trip.originITACode,
    endLocationITACode: trip.destinationITACode,
    JSON: JSON.stringify(trip),
    photoURL: trip.photo,
  });
  if (res.status !== 200) {
    throw new Error("Failed to post trip");
  } else {
    res = await getTripCompletion(res.data.tripId);
    if (res.status !== 200) {
      throw new Error("Failed to generate trip completion");
    }
    return res;
  }
};

const getTripCompletion = async (tripId) => {
  const res = await api.post(`/ai/complete`, {
    tripId,
  });
  return res.data;
};

export { api, postTrip, getTripCompletion };
