import { useRecoilValue, useSetRecoilState, atom } from "recoil";

const isHostState = atom({
  key: "crowdQ.storage.isHost",
  default: false,
  persistence_UNSTABLE: true,
});

export function useIsHost() {
  return useRecoilValue(isHostState);
}

export function useSetIsHost() {
  return useSetRecoilState(isHostState);
}
