import { atom } from "recoil";

export const usernameState = atom({
  key: "crowdQ.storage.username",
  default: "",
  persistence_UNSTABLE: true,
});
