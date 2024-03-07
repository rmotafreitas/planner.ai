import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { UserIdContext } from "@/contexts/user.context";
import { hankoApi, hankoInstance, isLogged } from "@/lib/hanko";
import { register } from "@teamhanko/hanko-elements";
import { History, LogOutIcon, UserIcon, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MAP } from "@/lib/locationsMap";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/myapi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

export function ProfilePage() {
  const hanko = useMemo(() => hankoInstance, []);

  const { setUserId } = useContext(UserIdContext);
  const router = useNavigate();

  const [userData, setUserData] = useState({});

  if (!isLogged()) {
    router("/auth");
  }

  const handleHankoLogout = async () => {
    setUserId("");
    await hanko.user.logout();
    router("/auth");
  };

  async function getUserData() {
    let email;
    try {
      email = (await hanko.user.getCurrent()).email;
    } catch (error) {
      console.error("Failed to get user data", error);
      handleHankoLogout();
    }
    api
      .post("/user/save", {
        email: email,
      })
      .then((res) => {
        console.log(res.data);
        setUserData(res.data);
      });
  }

  useEffect(() => {
    register(hankoApi)
      .catch((error) => {
        console.error("Failed to register Hanko API", error);
        handleHankoLogout();
      })
      .then(() => {
        try {
          getUserData();
        } catch (error) {
          console.error("Failed to get user data", error);
          handleHankoLogout();
        }
      });
  }, []);

  const inputRef = useRef(null);
  const [search, setSearch] = useState("");

  const options = Object.keys(MAP).map((key) => ({
    label: MAP[key],
    value: key,
  }));
  const [startLocationOpen, setStartLocationOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col gap-4 max-w-xl w-full p-8 border-border border-2 rounded-lg max-sm:border-0">
          <h1 className="font-black text-3xl justify-center items-center text-center flex flex-row gap-4">
            <p>My Profile</p>
            <UserIcon className="w-8 h-8" />
          </h1>
          <hanko-profile />
          <section className="w-full flex flex-row justify-center gap-2 items-center max-sm:flex-col">
            <Button className="flex flex-1 text-white bg-primary max-sm:w-full">
              <Link
                to="/me/logs"
                className="flex flex-row items-center w-full h-full justify-center"
              >
                <History size={24} className="mr-2" />
                History
              </Link>
            </Button>
            <Button className="flex flex-1 bg-yellow-500 text-white hover:bg-yellow-600 max-sm:w-full justify-center items-center">
              <Mail size={24} className="mr-2" />
              <Dialog>
                <DialogTrigger>News Letter</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>NewsLetter Settings</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col gap-2 my-4 w-full justify-start">
                        <p>
                          Required to fill the initial location to get the news
                          letter!
                        </p>
                        <Popover
                          open={startLocationOpen}
                          onOpenChange={setStartLocationOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={startLocationOpen}
                              className="w-full justify-between overflow-clip"
                            >
                              {userData?.itaCode
                                ? options.find((option) => {
                                    return (
                                      option.value.toLowerCase() ===
                                      userData?.itaCode.toLocaleLowerCase()
                                    );
                                  })?.label
                                : "Select initial city..."}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="right"
                            className="p-0"
                            align="start"
                          >
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
                                        setUserData({
                                          ...userData,
                                          itaCode:
                                            currentValue === userData?.itaCode
                                              ? ""
                                              : currentValue.toUpperCase(),
                                        });
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
                      <div className="flex flex-row gap-2 my-4 w-full justify-start items-center">
                        <Checkbox
                          checked={userData?.subscribedToNewsletter}
                          onCheckedChange={(checked) => {
                            setUserData({
                              ...userData,
                              subscribedToNewsletter: checked,
                            });
                          }}
                        />
                        <p>
                          Get daily news letter about the cities that you want
                          to go?
                        </p>
                      </div>
                      <div className="flex flex-row gap-2 my-4">
                        <Input ref={inputRef} placeholder="Search city..." />
                        <Button
                          className="bg-primary text-white hover:bg-primary-dark"
                          onClick={() => {
                            setSearch(inputRef.current.value);
                          }}
                        >
                          Search
                        </Button>
                      </div>
                      <ScrollArea className="h-96">
                        {Object.keys(MAP).map((city) => {
                          if (
                            MAP[city]
                              .toLowerCase()
                              .includes(search.toLowerCase()) &&
                            city.toLocaleLowerCase() !==
                              userData?.itaCode?.toLocaleLowerCase()
                          ) {
                            return (
                              <div key={city} className="flex flex-row gap-2">
                                <Checkbox
                                  label={MAP[city]}
                                  name={city}
                                  id={city}
                                  checked={userData?.wishList?.includes(city)}
                                  onCheckedChange={(checked) => {
                                    if (!checked) {
                                      const str = userData.wishList
                                        .split(",")
                                        .filter((c) => c !== city)
                                        .join(",");
                                      setUserData({
                                        ...userData,
                                        wishList: str,
                                      });
                                    } else {
                                      setUserData({
                                        ...userData,
                                        wishList:
                                          userData.wishList != null
                                            ? `${userData.wishList},${city}`
                                            : city,
                                      });
                                    }
                                  }}
                                />
                                <p>{MAP[city]}</p>
                              </div>
                            );
                          }
                        })}
                      </ScrollArea>
                      <div className="flex flex-row gap-2 mt-4 justify-end items-center w-full">
                        <Button
                          className="bg-red-500 text-white hover:bg-red-600"
                          onClick={() => {
                            setSearch("");
                            inputRef.current.value = "";
                            setUserData({
                              ...userData,
                              wishList: "",
                            });
                          }}
                        >
                          Clear
                        </Button>
                        <Button
                          className="bg-primary text-white hover:bg-primary-dark"
                          onClick={() => {
                            console.log("Save");
                            console.log(userData);
                            api
                              .post("/user/save", {
                                ...userData,
                              })
                              .then((res) => {
                                console.log(res.data);
                              });
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </Button>
            <Button
              className="flex flex-1 bg-red-500 text-white hover:bg-red-600 max-sm:w-full justify-center items-center"
              onClick={handleHankoLogout}
            >
              <LogOutIcon size={24} className="mr-2" />
              Logout
            </Button>
          </section>
        </div>
      </section>
    </div>
  );
}
