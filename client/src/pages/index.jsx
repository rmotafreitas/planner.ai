import { FormExplore } from "@/components/form-explore";

export function HomePage() {
  return (
    <div className="flex flex-col gap-6 min-h-screen min-w-full">
      <div className="bg-hero w-full bg-inherit bg-no-repeat bg-cover min-h-96 justify-center items-center flex flex-col">
        <FormExplore />
      </div>
    </div>
  );
}
