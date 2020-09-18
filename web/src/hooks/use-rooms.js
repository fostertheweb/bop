import { useQuery } from "react-query";
import axios from "axios";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export function useRooms() {
  return useQuery("rooms", async function () {
    const { data } = await axios.get(`${API_BASE_URL}/rooms`);
    return data;
  });
}

export function useRoom(id) {
  return useQuery(id && ["room", id], async () => {
    const { data } = await axios.get(`${API_BASE_URL}/rooms/${id}`);
    return data;
  });
}
