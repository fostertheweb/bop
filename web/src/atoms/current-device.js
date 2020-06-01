import { atom } from "recoil";

export const currentDeviceAtom = atom({
	key: "crowdQ.storage.currentDevice",
	default: null,
	persistence_UNSTABLE: true,
});
