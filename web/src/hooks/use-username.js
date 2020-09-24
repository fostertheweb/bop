import { atom, useSetRecoilState, useRecoilValue } from "recoil";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import axios from "axios";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

const usernameState = atom({
  key: "crowdQ.storage.username",
  default: null,
  persistence_UNSTABLE: true,
});

export function useUsername() {
  return useRecoilValue(usernameState);
}

export function useCheckUsername(username) {
  const { id: room } = useParams();
  const { status } = useQuery(
    username && ["check", username],
    async () => {
      return await axios.get(
        `${API_BASE_URL}/rooms/${room}/join?username=${username}`,
      );
    },
    { retry: false },
  );

  return status;
}

export function useSetUsername() {
  return useSetRecoilState(usernameState);
}
