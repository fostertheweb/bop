import { useEffect } from "react";
import { stringify } from "query-string";
import { currentDeviceAtom } from "../atoms/current-device";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAccessTokenAtom } from "../atoms/user-credentials";
import { useQueue } from "./use-queue";
import { currentPlaybackAtom, isPlayingAtom } from "atoms/player";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export const usePlayer = () => {
	const currentDevice = useRecoilValue(currentDeviceAtom);
	const setIsPlaying = useSetRecoilState(isPlayingAtom);
	const setCurrentPlayback = useSetRecoilState(currentPlaybackAtom);
	const userAccessToken = useRecoilValue(userAccessTokenAtom);
	const { queue, nextTrackInQueue } = useQueue();

	useEffect(() => {
		async function getCurrentPlayback() {
			try {
				const response = await fetch(`${SPOTIFY_API_URL}/me/player`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${userAccessToken}`,
					},
				});
				const { is_playing, item, progress_ms } = await response.json();

				if (response.ok) {
					setIsPlaying(is_playing);
					setCurrentPlayback({ ...item, progress_ms });
				}
			} catch (err) {
				console.log("error", err);
			}
		}

		getCurrentPlayback();
	}, [userAccessToken, queue]);

	async function restartCurrentTrack() {
		await fetch(
			`${SPOTIFY_API_URL}/me/player/seek?${stringify({
				position_ms: 0,
				device_id: currentDevice.id,
			})}`,
			{
				method: "PUT",
				headers: { Authorization: `Bearer ${userAccessToken}` },
			},
		);
	}

	async function playNextTrack() {
		console.log({ playNextTrack: queue });
		const nextTrack = queue[0];
		console.log({ nextTrack });

		if (nextTrack) {
			const response = await fetch(
				`${SPOTIFY_API_URL}/me/player/play?${stringify({
					device_id: currentDevice.id,
				})}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${userAccessToken}`,
					},
					body: JSON.stringify({ uris: [nextTrack.uri] }),
				},
			);

			if (response.ok) {
				nextTrackInQueue();
			}
		}
	}

	async function play() {
		const response = await fetch(
			`${SPOTIFY_API_URL}/me/player/play?${stringify({
				device_id: currentDevice.id,
			})}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${userAccessToken}`,
				},
			},
		);

		if (response.ok) {
			setIsPlaying(true);
		}
	}

	async function pause() {
		const response = await fetch(
			`${SPOTIFY_API_URL}/me/player/pause?${stringify({
				device_id: currentDevice.id,
			})}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${userAccessToken}`,
				},
			},
		);

		if (response.ok) {
			setIsPlaying(false);
		}
	}

	return {
		pause,
		play,
		playNextTrack,
		restartCurrentTrack,
	};
};
