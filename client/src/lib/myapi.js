import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: `Bearer ${Cookies.get("hanko")}`,
  },
});
