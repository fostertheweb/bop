import { atom, useSetRecoilState } from "recoil";

export const listenersState = atom({
  key: "crowdQ.listeners",
  default: [],
});

export function useListeners() {
  const setListeners = useSetRecoilState(listenersState);

  function addListener(listener) {
    setListeners((listeners) => [...listeners, listener]);
  }

  function removeListener(index) {
    setListeners((listeners) => [
      ...listeners.slice(0, index),
      ...listeners.slice(index + 1),
    ]);
  }

  return { addListener, removeListener };
}
