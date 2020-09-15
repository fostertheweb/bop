import { queryCache, useMutation } from "react-query";
import axios from "axios";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

async function createRoom(details) {
  const { data } = await axios.post(`${API_BASE_URL}/rooms`, details);
  return data;
}

export function useCreateRoom() {
  return useMutation(createRoom, {
    onSuccess() {
      return queryCache.refetchQueries("rooms");
    },
  });
}
