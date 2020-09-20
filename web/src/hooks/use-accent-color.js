import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const accentColorState = atom({
  key: "crowdQ.accentColor",
  default: "blue",
});

export function useAccentColor() {
  return useRecoilValue(accentColorState);
}

export function useSetAccentColor() {
  return useSetRecoilState(accentColorState);
}
