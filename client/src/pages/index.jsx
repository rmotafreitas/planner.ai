import { Button } from "@/components/ui/button";
import { handleExplore } from "@/lib/services";
import {
  Calendar as CalendarIconPhospor,
  MapPin,
  Wallet,
} from "@phosphor-icons/react";

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

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import { Input } from "@/components/ui/input";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MAP } from "@/lib/locationsMap";
import { useState } from "react";

const options = Object.keys(MAP).map((key) => ({
  label: MAP[key],
  value: key,
}));

export function HomePage() {
  const [startLocationOpen, setStartLocationOpen] = useState(false);
  const [endLocationOpen, setEndLocationOpen] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [date, setDate] = useState();

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
              <Popover
                open={startLocationOpen}
                onOpenChange={setStartLocationOpen}
              >
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
                            value={option.value}
                            onSelect={(currentValue) => {
                              setStartLocation(
                                currentValue === startLocation
                                  ? ""
                                  : currentValue
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
          <div className="flex flex-row gap-2 justify-evenly flex-1">
            <div className="border-solid border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
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
                            value={option.value}
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
          <div className="flex flex-row gap-2 justify-evenly flex-1">
            <div className="border-solid border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
              <Wallet size={32} weight="fill" className="text-primary" />
            </div>
            <div>
              <h1 className="text-sm text-primary">Price Range $</h1>
              <div className="flex flex-row justify-center items-center gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  className="w-20 text-center"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  className="w-20 text-center"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 justify-evenly flex-1">
            <div className="border-solid border-2 border-border justify-center flex items-center rounded-md w-12 h-12">
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
            onClick={() => {
              handleExplore({
                origin: "OPO",
                destination: "HND",
                date: "2024-03-07",
                adults: 1,
                max: 5,
                priceRange: [800, 1000],
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
