import { UserIdContext } from "@/contexts/user.context";
import { hankoApi, hankoInstance } from "@/lib/hanko";
import { register } from "@teamhanko/hanko-elements";
import { useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navbar";

export function LoginPage() {
  const { setUserId } = useContext(UserIdContext);

  const router = useNavigate();

  const hanko = useMemo(() => hankoInstance, []);

  const handleAuthFlowCompleted = async () => {
    const user = await hanko.user.getCurrent();
    setUserId(user.id);
    router("/");
  };

  useEffect(
    () =>
      hanko.onAuthFlowCompleted(() => {
        handleAuthFlowCompleted();
      }),
    [hanko]
  );

  useEffect(() => {
    register(hankoApi).catch((error) => {
      console.error(error);
      // handle error
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="flex flex-1 flex-col justify-center gap-20 items-center">
        <h1 className="font-bold text-5xl text-center">Start working faster</h1>
        <hanko-auth />
      </section>
    </div>
  );
}
