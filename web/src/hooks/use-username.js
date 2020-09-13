import { atom, useSetRecoilState, useRecoilValue } from "recoil";
import { useQuery } from "react-query";
import { useParams } from "react-router";

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
    ["check", username],
    async (_, uid) => {
      const response = await fetch(
        `${API_BASE_URL}/rooms/${room}/check-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: uid }),
        },
      );

      if (response.ok) {
        return await response.json();
      }

      throw await response.json();
    },
    { enabled: username, retry: false },
  );

  return status;
}

export function useSetUsername() {
  return useSetRecoilState(usernameState);
}
