import { queryCache, useMutation } from "react-query";
import axios from "axios";

const { REACT_APP_API_URL: API_URL } = process.env;

async function createRoom(details) {
  const { data } = await axios.post(`${API_URL}/rooms`, details);
  return data;
}

export function useCreateRoom() {
  return useMutation(createRoom, {
    onSuccess() {
      return queryCache.refetchQueries("rooms");
    },
  });
}
