import { FormExplore } from "@/components/form-explore";
import { Navbar } from "@/components/navbar";

export function HomePage() {
  return (
    <div className="flex flex-col gap-6 min-h-screen min-w-full">
      <Navbar />
      <div className="w-full bg-inherit bg-no-repeat bg-cover min-h-96 justify-center items-center flex flex-col">
        <FormExplore />
      </div>
    </div>
  );
}
