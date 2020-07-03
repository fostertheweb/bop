import React, { useState, useEffect } from "react";
import { stringify } from "query-string";
import { currentDeviceAtom } from "../atoms/current-device";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { userAccessTokenAtom } from "../atoms/user-credentials";
import { useQueue } from "./use-queue";
import { currentPlaybackAtom, isPlayingAtom } from "atoms/player";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export const usePlayer = () => {
	const currentDevice = useRecoilValue(currentDeviceAtom);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
	const setCurrentPlayback = useSetRecoilState(currentPlaybackAtom);
	const userAccessToken = useRecoilValue(userAccessTokenAtom);
	const { queue, removeFromQueue } = useQueue();

	useEffect(() => {
		console.log({ isPlaying });
	}, [isPlaying]);

	useEffect(() => {
		async function getCurrentPlayback() {
			const response = await fetch(`${SPOTIFY_API_URL}/me/player`, {
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
		const nextTrack = queue[0];

		if (nextTrack) {
			await fetch(
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
			setIsPlaying(true);
			removeFromQueue(0);
		}
	}

	async function play() {
		await fetch(
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
		setIsPlaying(true);
	}

	async function pause() {
		await fetch(
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
		setIsPlaying(false);
	}

	return {
		pause,
		play,
		playNextTrack,
		restartCurrentTrack,
	};
};
