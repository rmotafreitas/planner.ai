import { Navbar } from "@/components/navbar";
import { UserIdContext } from "@/contexts/user.context";
import { getTripCompletion } from "@/lib/myapi";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function TripPageVisualizer() {
  const { tripId } = useParams();

  const { userId } = useContext(UserIdContext);
  const router = useNavigate();

  if (!userId) {
    // router("/auth");
  }

  const [trip, setTrip] = useState(null);

  const loadTrip = async (trip) => {
    const res = await getTripCompletion(trip);
    return res;
  };

  useEffect(() => {
    if (tripId) {
      loadTrip(tripId).then((res) => {
        console.log("Loaded trip: ", res);
        setTrip(res);
      });
    }
  }, [tripId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="bg-muted-foreground flex flex-row flex-1 justify-center">
        <article className="bg-primary-foreground w-3/4">
          <h1></h1>
        </article>
      </section>
    </div>
  );
}
