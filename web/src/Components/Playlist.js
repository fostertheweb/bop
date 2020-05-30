import React from "react";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSpinnerThird,
	faChevronLeft,
} from "@fortawesome/pro-solid-svg-icons";
import { usePlaylists } from "../hooks/usePlaylists";
import { useParams, useNavigate } from "react-router-dom";
import { useQueue } from "../hooks/useQueue";
import { useRecoilValue } from "recoil";
import { userAccessToken } from "../atoms/user-credentials";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export default function Playlist() {
	const token = useRecoilValue(userAccessToken);
	const { addToQueue } = useQueue();
	const { playlists } = usePlaylists();
	const { playlistId } = useParams();
	const navigate = useNavigate();
	const playlist = playlists.find(({ id }) => id === playlistId);
	const { status, data: items } = useQuery("playlistTracks", [], async () => {
		const response = await fetch(
			`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		const { items } = await response.json();
		return items;
	});

	return (
		<div>
			<div className="flex items-center justify-between p-4 text-gray-500">
				<button
					className="appearance-none cursor-pointer hover:text-gray-300 font-medium"
					onClick={() => navigate("/host/playlists")}>
					<FontAwesomeIcon
						icon={faChevronLeft}
						size="lg"
						className="fill-current mr-2"
					/>
					Back
				</button>
				<h1 className="text-center text-gray-500 font-medium text-lg tracking-wide">
					{playlist?.name}
				</h1>
				<span>&nbsp;</span>
			</div>
			<div>
				{status === "loading" ? (
					<FontAwesomeIcon icon={faSpinnerThird} />
				) : (
					items.map((item) => (
						<div
							key={item.track.id}
							onClick={() => addToQueue(item.track)}
							className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 transition ease-in-out duration-150">
							<div className="">
								<img
									src={item.track.album.images[2].url}
									alt="album art"
									className="shadow h-10 w-10"
								/>
							</div>
							<div className="ml-4">
								<div className="text-gray-400">{item.track.name}</div>
								<div className="text-gray-500">
									{item.track.artists.map(({ name }) => name).join(", ")}
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
