import { Hanko } from "@teamhanko/hanko-elements";
import Cookies from "js-cookie";
import * as jose from "jose";

export const hankoApi = import.meta.env.VITE_HANKO_API_URL;

export const hankoInstance = new Hanko(hankoApi);

export const isLogged = () => {
  const token = Cookies.get("hanko");
  const payload = jose.decodeJwt(token ?? "");
  const userID = payload.sub;

  return !(!userID || token === undefined);
};
