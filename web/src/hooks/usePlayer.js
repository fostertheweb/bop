import React, { useState, useContext, createContext, useEffect } from "react";
import { stringify } from "query-string";
import { currentDeviceState } from "../atoms/current-device";
import { useRecoilValue } from "recoil";
import { userAccessTokenAtom } from "../atoms/user-credentials";
import { useQueue } from "./useQueue";

export const PlayerContext = createContext(false);

export const PlayerProvider = ({ children }) => {
	const player = usePlayerProvider();

	return (
		<PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
	);
};

export const usePlayer = () => {
	return useContext(PlayerContext);
};

function usePlayerProvider() {
	const currentDevice = useRecoilValue(currentDeviceState);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentPlayback, setCurrentPlayback] = useState(null);
	const userAccessToken = useRecoilValue(userAccessTokenAtom);
	const { queue, removeFromQueue } = useQueue();

	useEffect(() => {
		console.log({ isPlaying });
	}, [isPlaying]);

	useEffect(() => {
		async function getCurrentPlayback() {
			const response = await fetch("https://api.spotify.com/v1/me/player", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${userAccessToken}`,
				},
			});

			try {
				const { is_playing, item, progress_ms } = await response.json();
				setIsPlaying(is_playing);
				setCurrentPlayback({ ...item, progress_ms });
			} catch (err) {
				console.log("error", err);
			}
		}
		getCurrentPlayback();
	}, [userAccessToken]);

	async function restartCurrentTrack() {
		await fetch(
			`https://api.spotify.com/v1/me/player/seek?${stringify({
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
		const nextTrack = queue[0];

		if (nextTrack) {
			await fetch(
				`https://api.spotify.com/v1/me/player/play?${stringify({
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
			setIsPlaying(true);
			removeFromQueue(0);
		}
	}

	async function play() {
		await fetch(
			`https://api.spotify.com/v1/me/player/play?${stringify({
				device_id: currentDevice.id,
			})}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${userAccessToken}`,
				},
			},
		);
		setIsPlaying(true);
	}

	async function pause() {
		await fetch(
			`https://api.spotify.com/v1/me/player/pause?${stringify({
				device_id: currentDevice.id,
			})}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${userAccessToken}`,
				},
			},
		);
		setIsPlaying(false);
	}

	return {
		isPlaying,
		pause,
		play,
		playNextTrack,
		currentPlayback,
		restartCurrentTrack,
		setCurrentPlayback,
	};
}
