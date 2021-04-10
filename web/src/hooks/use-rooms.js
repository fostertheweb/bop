import { useQuery } from "react-query";
import axios from "axios";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "react-router";
import { useEffect } from "react";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

const roomIdState = atom({
  key: "crowdQ.storage.roomId",
  default: null,
  persistence_UNSTABLE: true,
});

export function useRoomId() {
  const { id } = useParams();
  const cachedRoomId = useRecoilValue(roomIdState);

  return id || cachedRoomId;
}

export function useSetRoomId() {
  return useSetRecoilState(roomIdState);
}

export function useRooms() {
  return useQuery("rooms", async function () {
    const { data } = await axios.get(`${API_BASE_URL}/rooms`);
    return data;
  });
}

export function useRoom() {
  const { id } = useParams();
  const setRoomId = useSetRoomId();

  useEffect(() => {
    setRoomId(id);
  }, [id, setRoomId]);

  return useQuery(id && ["room", id], async () => {
    const { data } = await axios.get(`${API_BASE_URL}/rooms/${id}`);
    return data;
  });
}
