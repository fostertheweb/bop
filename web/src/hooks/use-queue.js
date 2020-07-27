import { atom, useSetRecoilState } from "recoil";

export const playQueueAtom = atom({
  key: "crowdQ.playQueue",
  default: [],
});

export function useQueue() {
  const setQueue = useSetRecoilState(playQueueAtom);

  function addToQueue(item) {
    setQueue((queue) => [...queue, item]);
  }

  function removeFromQueue(index) {
    setQueue((queue) => [...queue.slice(0, index), ...queue.slice(index + 1)]);
  }

  function nextTrackInQueue() {
    setQueue((queue) => queue.slice(1));
  }

  return { addToQueue, removeFromQueue, nextTrackInQueue };
}
