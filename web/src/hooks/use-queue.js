import { atom, useRecoilState } from "recoil";

export const playQueueAtom = atom({
  key: "crowdQ.playQueue",
  default: [],
});

export function useQueue() {
  const [queue, setQueue] = useRecoilState(playQueueAtom);

  function addToQueue(item) {
    setQueue([...queue, item]);
  }

  function removeFromQueue(index) {
    setQueue([...queue.slice(0, index), ...queue.slice(index + 1)]);
  }

  function nextTrackInQueue() {
    setQueue(queue.slice(1));
  }

  return { addToQueue, removeFromQueue, nextTrackInQueue };
}
