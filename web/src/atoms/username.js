import { atom } from "recoil";

export const usernameState = atom({
  key: "crowdQ.username",
  default: "",
  persistence_UNSTABLE: true,
});
