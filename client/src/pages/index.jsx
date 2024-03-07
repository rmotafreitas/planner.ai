import { FormExplore } from "@/components/form-explore";
import { Navbar } from "@/components/navbar";

export function HomePage() {
  return (
    <div className="flex flex-col gap-6 min-h-screen min-w-full">
      <Navbar />
      <div className="w-full bg-inherit bg-no-repeat bg-cover min-h-96 justify-center items-center flex flex-col">
        <section className="flex flex-col justify-center items-center gap-6 mb-10">
          <h1 className="bg-clip-text text-transparent font-bold text-7xl bg-gradient-to-r from-[#5350F6] to-[#E662FE] mt-20 text-center">
            AI Trip Planner
          </h1>
          <p className="text-5xl text-center max-w-7xl leading-relaxed">
            Welcome to the AI Trip Planner, your ultimate tool for planning
            seamless and unforgettable journeys.
          </p>
          <p className="text-2xl font-semibold text-[#FF3BFF]">
            Simplify your travel planning with AI
          </p>
        </section>
        <FormExplore />
        <section className="flex flex-col justify-center items-center gap-6 mt-10 mb-20">
          <h2 className="bg-clip-text text-transparent font-bold text-5xl bg-gradient-to-r from-[#5350F6] to-[#E662FE] text-center pb-2">
            Elevate your travel experiences
          </h2>
          <h3 className="text-3xl text-center max-w-7xl">
            Plan your trips effortlessly and discover new destinations with ease
            using our AI-powered Trip Planner.
          </h3>
        </section>
        <section className="flex flex-row justify-evenly w-5/6 items-center gap-6 mb-16 max-md:flex-col max-md:items-center"></section>
      </div>
    </div>
  );
}
