import React, { useEffect } from "react";
import { useSpotify } from "./useSpotify";
import { useQuery } from "react-query";

export function useDevices() {
	const { userCredentials } = useSpotify();
	const { status, data, refetch } = useQuery(
		"devices",
		[userCredentials.access_token],
		async () => {
			const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
				headers: {
					Authorization: `Bearer ${userCredentials.access_token}`,
				},
			});
			const { devices } = await response.json();
			return devices;
		},
		{ retry: 3 },
	);

	useEffect(() => {
		refetch();
	}, [userCredentials, refetch]);

	return { status, devices: data };
}

// TODO
// - resume music on newly selected device if currently playing
