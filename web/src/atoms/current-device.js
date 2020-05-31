import { atom } from "recoil";

export const currentDeviceState = atom({
	key: "crowdQ.storage.currentDeviceState",
	default: null,
	persistence_UNSTABLE: true,
});
