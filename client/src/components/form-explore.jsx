import { Button } from "@/components/ui/button";
import { handleExplore } from "@/lib/services";
import {
  Calendar as CalendarIconPhospor,
  MapPin,
  Wallet,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MAP } from "@/lib/locationsMap";
import { useRef, useState } from "react";

const options = Object.keys(MAP).map((key) => ({
  label: MAP[key],
  value: key,
}));

const statusMessages = {
  flights: "Searching for flights...",
  hotels: "Searching for hotels...",
  weather: "Getting weather information...",
  activities: "Getting activities...",
  photo: "Getting photo...",
  gpt: "Generating trip plan...",
};

export function FormExplore() {
  const router = useNavigate();
  const [status, setStatus] = useState("waiting");

  const [startLocationOpen, setStartLocationOpen] = useState(false);
  const [endLocationOpen, setEndLocationOpen] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [date, setDate] = useState();
  const maxPrice = useRef();

  if (status !== "waiting") {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <img
          className="w-36 h-36 animate-spin"
          src="/laoder.gif"
          alt="loading"
        />
        <p className="text-primary text-2xl font-bold mt-4">
          {statusMessages[status] || "Loading..."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md w-fit flex flex-row max-xl:flex-col gap-4 justify-center items-center py-2 px-4 shadow-lg">
      <div className="flex flex-row gap-2 justify-evenly flex-1 items-center">
        <div className="border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
          <MapPin size={32} weight="fill" className="text-primary" />
        </div>
        <div>
          <h1 className="text-sm text-primary">Destination</h1>
          <Popover open={startLocationOpen} onOpenChange={setStartLocationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={startLocationOpen}
                className="w-[200px] justify-between overflow-clip"
              >
                {startLocation
                  ? options.find((option) => {
                      return (
                        option.value.toLowerCase() ===
                        startLocation.toLocaleLowerCase()
                      );
                    })?.label
                  : "Select city..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 h-52">
              <Command>
                <CommandInput placeholder="Search city..." />
                <CommandEmpty>No city found.</CommandEmpty>
                <ScrollArea
                  className="w-full h-full"
                  style={{ maxHeight: "200px" }}
                >
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={(currentValue) => {
                          setStartLocation(
                            currentValue === startLocation ? "" : currentValue
                          );
                          setStartLocationOpen(false);
                        }}
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-evenly flex-1 items-center">
        <div className="border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
          <MapPin size={32} weight="fill" className="text-primary" />
        </div>
        <div>
          <h1 className="text-sm text-primary">Destination</h1>
          <Popover open={endLocationOpen} onOpenChange={setEndLocationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={setEndLocationOpen}
                className="w-[200px] justify-between overflow-clip"
              >
                {endLocation
                  ? options.find((option) => {
                      return (
                        option.value.toLowerCase() ===
                        endLocation.toLocaleLowerCase()
                      );
                    })?.label
                  : "Select city..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 h-52 overflow-visible">
              <Command>
                <CommandInput placeholder="Search city..." />
                <CommandEmpty>No city found.</CommandEmpty>
                <ScrollArea
                  className="w-full h-full"
                  style={{ maxHeight: "200px" }}
                >
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={(currentValue) => {
                          setEndLocation(
                            currentValue === endLocation ? "" : currentValue
                          );
                          setEndLocationOpen(false);
                        }}
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-evenly flex-1 items-center">
        <div className="border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
          <Wallet size={32} weight="fill" className="text-primary" />
        </div>
        <div>
          <h1 className="text-sm text-primary">Max Flight Price $</h1>
          <Input
            placeholder="Max"
            type="number"
            className="text-left"
            min={0}
            ref={maxPrice}
          />
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-evenly flex-1 items-center">
        <div className="border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
          <CalendarIconPhospor
            size={32}
            weight="fill"
            className="text-primary"
          />
        </div>
        <div>
          <h1 className="text-sm text-primary">Date</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Button
        className="text-white"
        onClick={() => {
          handleExplore({
            origin: startLocation.toUpperCase(),
            destination: endLocation.toUpperCase(),
            date: date
              ? format(date, "yyyy-MM-dd")
              : format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
            adults: 1,
            max: 10,
            maxPrice: +maxPrice.current.value,
            setStatus,
          })
            .then((res) => {
              console.log("res", res);
              if (res) {
                router(`/me/trip/${res.trip.id}`);
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }}
      >
        <p>Explore Now!</p>
      </Button>
    </div>
  );
}
