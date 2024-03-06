import { MapPin, Wallet, Calendar } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { handleExplore } from "@/lib/services";

export function HomePage() {
  return (
    <div className="flex flex-col gap-6 min-h-screen min-w-full">
      <div className="bg-hero w-full bg-inherit bg-no-repeat bg-cover min-h-96 justify-center items-center flex flex-col">
        <div className="bg-muted rounded-md w-fit flex flex-row gap-4 justify-center items-center py-2 px-4">
          <div className="flex flex-row gap-2 justify-evenly flex-1">
            <div className="border-solid border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
              <MapPin size={32} weight="fill" className="text-primary" />
            </div>
            <div>
              <h1 className="text-sm text-primary">Destination</h1>
              <p className="font-semibold text-foreground">Portugal, Porto</p>
            </div>
          </div>
          <div className="flex flex-row gap-2 justify-evenly flex-1">
            <div className="border-solid border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
              <MapPin size={32} weight="fill" className="text-primary" />{" "}
            </div>
            <div>
              <h1 className="text-sm text-primary">Destination</h1>
              <p className="font-semibold text-foreground">Japão, Tokyo</p>
            </div>
          </div>
          <div className="flex flex-row gap-2 justify-evenly flex-1">
            <div className="border-solid border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
              <Wallet size={32} weight="fill" className="text-primary" />
            </div>
            <div>
              <h1 className="text-sm text-primary">Price Range</h1>
              <p className="font-semibold text-foreground">800$ - 1000$</p>
            </div>
          </div>
          <div className="flex flex-row gap-2 justify-evenly flex-1">
            <div className="border-solid border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
              <Calendar size={32} weight="fill" className="text-primary" />
            </div>
            <div>
              <h1 className="text-sm text-primary">Date</h1>
              <p className="font-semibold text-foreground">07-03-2024</p>
            </div>
          </div>
          <Button
            onClick={() => {
              handleExplore({
                origin: "OPO",
                destination: "LON",
                date: "2024-03-07",
                adults: 1,
                max: 5,
              });
            }}
          >
            <p>Explore Now!</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
