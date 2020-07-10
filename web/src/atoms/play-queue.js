import { atom } from "recoil";

export const playQueueAtom = atom({
	key: "crowdQ.storage.playQueue",
	default: [],
	persistence_UNSTABLE: true,
});
