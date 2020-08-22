import { atom, useSetRecoilState } from "recoil";

export const songRequestsState = atom({
  key: "crowdQ.songRequests",
  default: [],
});

export function useSongRequests() {
  const setSongRequests = useSetRecoilState(songRequestsState);

  function addSongRequest(item) {
    setSongRequests((requests) => [...requests, item]);
  }

  function removeSongRequest(index) {
    setSongRequests((requests) => [
      ...requests.slice(0, index),
      ...requests.slice(index + 1),
    ]);
  }

  return { addSongRequest, removeSongRequest };
}
