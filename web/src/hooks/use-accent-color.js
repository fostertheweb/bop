import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const lightAccentColorState = atom({
  key: "crowdQ.lightAccentColor",
  default: null,
});

const darkAccentColorState = atom({
  key: "crowdQ.darkAccentColor",
  default: null,
});

export function useLightAccentColor() {
  return useRecoilValue(lightAccentColorState);
}

export function useSetLightAccentColor() {
  return useSetRecoilState(lightAccentColorState);
}

export function useDarkAccentColor() {
  return useRecoilValue(darkAccentColorState);
}

export function useSetDarkAccentColor() {
  return useSetRecoilState(darkAccentColorState);
}
