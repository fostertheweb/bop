import { selectorFamily, useSetRecoilState } from "recoil";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export const songRequestsState = selectorFamily({
  key: "crowdQ.songRequests",
  get: (room) => async () => {
    const response = await fetch(`${API_BASE_URL}/rooms/${room}/requests`);
    return await response.json();
  },
});

export function useSongRequests() {
  const setSongRequests = useSetRecoilState(songRequestsState);

  function addSongRequest(item) {
    setSongRequests((requests) => [...requests, item]);
  }

  function removeSongRequest(index) {
    setSongRequests((request) => [
      ...request.slice(0, index),
      ...request.slice(index + 1),
    ]);
  }

  return { addSongRequest, removeSongRequest };
}
