import * as jose from "jose";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    try {
      const token = Cookies.get("hanko");

      const payload = jose.decodeJwt(token ?? "");
      const userID = payload.sub;

      if (!userID || token === undefined) {
        throw new Error("Invalid token");
      }

      setIsLogged(true);
    } catch (error) {
      setIsLogged(false);
    }
  }, []);

  return (
    <nav className="flex px-8 py-4 justify-between w-full items-center border-border border-b-2">
      <Link to="/" className="text-primary font-bold text-2xl bg-gradient-to-r">
        Planner
      </Link>
      <ul className="flex gap-8 items-center">
        <ModeToggle />
        <li className="text-lg font-semibold">
          {/* <Link to="/2">2</Link> */}
        </li>
        <li className="text-lg font-semibold">
          <Link
            to={isLogged ? "/me" : "/auth"}
            className="bg-primary text-white px-4 py-1 rounded-lg"
          >
            {isLogged ? "Profile" : "Login"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
