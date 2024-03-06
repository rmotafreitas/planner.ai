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
  const res = await api.post("/trips", {
    startLocationITACode: trip.originITACode,
    endLocationITACode: trip.destinationITACode,
    JSON: JSON.stringify(trip),
    photoURL: trip.photo,
  });
  console.log(res.data);
  return res.data;
};

export { api, postTrip };
