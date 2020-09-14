import { useQuery } from "react-query";
import axios from "axios";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export function useRooms() {
  return useQuery("rooms", async function () {
    return await axios.get(`${API_BASE_URL}/rooms`);
  });
}
