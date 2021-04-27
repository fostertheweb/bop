import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { useMutation } from "react-query";
import Axios from "axios";
import { useParams } from "react-router";

const { REACT_APP_API_URL: API_URL } = process.env;

const isBotDisconnectedState = atom({
  key: "crowdQ.botDisconnected",
  default: false,
});

export function useIsBotDisconnected() {
  return useRecoilValue(isBotDisconnectedState);
}

export function useSetIsBotDisconnected() {
  return useSetRecoilState(isBotDisconnectedState);
}

export function useBotReconnect() {
  const { id } = useParams();
  const setIsBotDisconnected = useSetIsBotDisconnected();

  return useMutation(
    async () => {
      return await Axios.put(`${API_URL}/rooms/${id}/bot-reconnect`);
    },
    {
      retry: false,
      onSuccess() {
        setIsBotDisconnected(false);
      },
      onError(err) {
        console.log(err);
      },
    },
  );
}
