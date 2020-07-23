import { atom } from "recoil";

export const displayNameState = atom({
  key: "crowdQ.displayName",
  default: "",
  persistence_UNSTABLE: true,
});
