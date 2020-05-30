import React, { useState, useContext, createContext, useEffect } from "react";
import { stringify as stringifyQueryString } from "query-string";
import { currentDeviceState } from "../atoms/current-device";
import { useRecoilValue } from "recoil";
import { userAccessToken } from "../atoms/user-credentials";

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
	const token = useRecoilValue(userAccessToken);

	useEffect(() => {
		async function getCurrentPlayback() {
			const response = await fetch("https://api.spotify.com/v1/me/player", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
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
	}, [token]);

	async function playOrPause(uris) {
		if (currentDevice) {
			await fetch(
				`https://api.spotify.com/v1/me/player/${
					isPlaying ? "pause" : "play"
				}?` + stringifyQueryString({ device_id: currentDevice.id }),
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: uris ? JSON.stringify({ uris: [uris] }) : null,
				},
			);
			setIsPlaying(!isPlaying);
		}
	}

	async function skipPlayback(direction) {
		await fetch(`https://api.spotify.com/v1/me/player/${direction}`, {
			method: "POST",
			headers: { Authorization: `Bearer ${token}` },
		});
	}

	return {
		isPlaying,
		playOrPause,
		skipPlayback,
		currentPlayback,
		setCurrentPlayback,
	};
}
