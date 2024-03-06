import { Hanko } from "@teamhanko/hanko-elements";

export const hankoApi = import.meta.env.VITE_HANKO_API_URL;

export const hankoInstance = new Hanko(hankoApi);
