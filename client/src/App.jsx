import { MapPin, Wallet, Calendar } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function App() {
  return (
    <>
      <div className="rounded-md w-fit flex flex-row gap-4">
        <div className="flex flex-row gap-2 justify-evenly flex-1">
          <div className="border-solid border-2 border-purple-300 justify-center flex items-center rounded-md w-12 h-12">
            <MapPin size={32} weight="fill" className="text-primary" />
          </div>
          <div>
            <h1 className="text-sm">Destination</h1>
            <p className="font-semibold">San Francisco, CA</p>
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-evenly flex-1">
          <div className="border-solid border-2 border-purple-300 justify-center flex items-center rounded-md w-12 h-12">
            <MapPin size={32} weight="fill" color="purple" />
          </div>
          <div>
            <h1 className="text-sm">Destination</h1>
            <p className="font-semibold">San Francisco, CA</p>
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-evenly flex-1">
          <div className="border-solid border-2 border-purple-300 justify-center flex items-center rounded-md w-12 h-12">
            <Wallet size={32} weight="fill" color="purple" />
          </div>
          <div>
            <h1 className="text-sm">Price Range</h1>
            <p className="font-semibold">$800-$1000</p>
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-evenly flex-1">
          <div className="border-solid border-2 border-purple-300 justify-center flex items-center rounded-md w-12 h-12">
            <Calendar size={32} weight="fill" color="purple" />
          </div>
          <div>
            <h1 className="text-sm">Date</h1>
            <p className="font-semibold">$800-$1000</p>
          </div>
        </div>
        <Button>
          <p>Explore Now!</p>
        </Button>
      </div>
    </>
  );
}
