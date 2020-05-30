import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { userAccessToken } from "../atoms/user-credentials";
import { useRecoilValue } from "recoil";

export function useDevices() {
	const token = useRecoilValue(userAccessToken);
	const { status, data, refetch } = useQuery(
		"devices",
		[token],
		async () => {
			const response = await fetch(
				"https://api.spotify.com/v1/me/player/devices",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			const { devices } = await response.json();
			return devices;
		},
		{ retry: 3 },
	);

	useEffect(() => {
		refetch();
	}, [token, refetch]);

	return { status, devices: data };
}

// TODO
// - resume music on newly selected device if currently playing
