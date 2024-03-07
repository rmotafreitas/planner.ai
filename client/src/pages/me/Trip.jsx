import { ChatSection } from "@/components/chat-modal";
import { Navbar } from "@/components/navbar";
import { isLogged } from "@/lib/hanko";
import { getTripCompletion } from "@/lib/myapi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function TripPageVisualizer() {
  const { tripId } = useParams();

  const router = useNavigate();

  if (!isLogged()) {
    router("/auth");
  }

  const [tripData, setTripData] = useState(null);

  const loadTrip = async (trip) => {
    const res = await getTripCompletion(trip);
    return res;
  };

  useEffect(() => {
    if (tripId) {
      loadTrip(tripId).then((res) => {
        console.log("Loaded trip: ", res);
        setTripData(res);
      });
    }
  }, [tripId]);

  return (
    tripData && (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <section className="bg-muted-foreground flex flex-col flex-1 justify-center items-center pb-4">
          <article className="flex flex-col gap-4 bg-primary-foreground w-1/2 max-lg:w-11/12 px-4 py-8 my-4 border-primary border-4 rounded-sm">
            <h1 className="text-3xl font-semibold">
              ✈️ Travel plan:{" "}
              {tripData.trip.JSON.destination.country +
                " - " +
                tripData.trip.JSON.destination.region}
            </h1>
            <p className="text-lg font-semibold">
              {tripData.log.resultText.introductionText}
            </p>
            <img
              src={tripData.trip.JSON.photo}
              alt={`A photo of the destination (${tripData.trip.JSON.destination.country} - ${tripData.trip.JSON.destination.region})`}
              className="rounded-md w-full h-96 object-cover"
            />
            <p
              className="text-xl
              font-semibold"
            >
              Turiscticts atractions 🏦
            </p>
            <ul>
              {tripData.log.resultText.pointsOfInterest.map((place, index) => (
                <li className="text-lg" key={index}>
                  <span className="text-lg font-semibold">
                    {place.LOCATION}
                  </span>
                  <span className="text-lg">
                    {" - "}
                    {place.DESCRIPTION}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xl font-semibold">Tips</p>
            <p className="text-lg">Traveling tip 🚃</p>
            <p className="text-lg">
              {tripData.log.resultText.tips.TRAVEL_RELATED}
            </p>
            <p className="text-lg">Money saving tip 💰</p>
            <p className="text-lg">
              {tripData.log.resultText.tips.ECONOMY_RELATED}
            </p>
            <p className="text-xl font-semibold">Useful information</p>
            <p className="text-lg">Etiquette 🎩</p>
            <ul>
              {tripData.log.resultText.usefulInformations.ETIQUETTE.map(
                (etiquette, index) => (
                  <li key={index} className="text-lg">
                    {etiquette}
                  </li>
                )
              )}
            </ul>
            <p className="text-lg">Food 🍲</p>
            <ul>
              {tripData.log.resultText.usefulInformations.FOOD.map(
                (food, index) => (
                  <li key={index} className="text-lg">
                    {food}
                  </li>
                )
              )}
            </ul>
            <p className="text-lg">Greetings 🎉</p>
            <ul>
              {tripData.log.resultText.usefulInformations.GREETINGS.map(
                (greeting, index) => (
                  <li key={index} className="text-lg">
                    {greeting}
                  </li>
                )
              )}
            </ul>
            <p className="text-lg">Language 🗣️</p>
            <ul>
              {tripData.log.resultText.usefulInformations.LANGUAGE.map(
                (language, index) => (
                  <li key={index} className="text-lg">
                    {language.IN_LOCAL_LANGUAGE} - {language.PRONUNCIATION}
                  </li>
                )
              )}
            </ul>
            <p className="text-xl font-semibold">Weather 🌦️</p>
            <p className="text-lg">{tripData.log.resultText.weatherText}</p>
          </article>
          <ChatSection id={tripData.log.id} />
        </section>
      </div>
    )
  );
}
