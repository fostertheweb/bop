import { atom } from "recoil";

export const isPlayingAtom = atom({
	key: "crowdQ.isPlaying",
	default: false,
});

export const currentPlaybackAtom = atom({
	key: "crowdQ.currentPlayback",
	default: null,
});
