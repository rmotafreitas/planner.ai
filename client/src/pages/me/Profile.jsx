import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { UserIdContext } from "@/contexts/user.context";
import { hankoApi, hankoInstance, isLogged } from "@/lib/hanko";
import { register } from "@teamhanko/hanko-elements";
import { History, LogOutIcon, UserIcon, Star } from "lucide-react";
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

export function ProfilePage() {
  const hanko = useMemo(() => hankoInstance, []);

  const { setUserId } = useContext(UserIdContext);
  const router = useNavigate();

  if (!isLogged()) {
    router("/auth");
  }

  const handleHankoLogout = async () => {
    setUserId("");
    await hanko.user.logout();
    router("/auth");
  };

  useEffect(() => {
    register(hankoApi).catch((error) => {
      console.error("Failed to register Hanko API", error);
    });
  }, []);

  const inputRef = useRef(null);
  const [search, setSearch] = useState("");

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
              <Star size={24} className="mr-2" />
              <Dialog>
                <DialogTrigger>Wish List</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cities that you want to visit</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-row gap-2 my-4">
                        <Input ref={inputRef} placeholder="Search city..." />
                        <Button
                          onClick={() => {
                            console.log(inputRef.current.value);
                            setSearch(inputRef.current.value);
                          }}
                        >
                          Search
                        </Button>
                      </div>
                      <ScrollArea className="h-96">
                        {Object.keys(MAP).map((city) => {
                          console.log(city);
                          if (
                            MAP[city]
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return (
                              <div key={city} className="flex flex-row gap-2">
                                <Checkbox
                                  label={MAP[city]}
                                  name={city}
                                  id={city}
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
                          }}
                        >
                          Clear
                        </Button>
                        <Button
                          className="bg-primary text-white hover:bg-primary-dark"
                          onClick={() => {
                            console.log("Save");
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
