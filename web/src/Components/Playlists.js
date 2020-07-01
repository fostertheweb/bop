import React, { useEffect, useState } from "react";
import { useRecoilValueLoadable, useRecoilValue } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useNavigate } from "react-router";
import { currentUserIdState } from "atoms/user-details";
import { userPlaylistsQuery } from "atoms/playlists";

export default function Playlists() {
	const [playlists, setPlaylists] = useState([]);
	const userId = useRecoilValue(currentUserIdState);
	const { state, contents } = useRecoilValueLoadable(
		userPlaylistsQuery(userId),
	);
	const navigate = useNavigate();

	useEffect(() => {
		if (state === "hasValue" && contents) {
			setPlaylists(contents);
		}
	}, [state]);

	return (
		<>
			<h1 className="p-4 text-gray-500 font-medium text-lg tracking-wide">
				Playlists
			</h1>
			<div>
				{state === "loading" ? (
					<FontAwesomeIcon icon={faSpinnerThird} />
				) : (
					playlists.map((playlist) => (
						<div
							onClick={() =>
								navigate(`${playlist.id}`, { state: { playlist } })
							}
							className="p-4 text-gray-400 flex items-center cursor-pointer hover:bg-gray-700 transition ease-in-out duration-150">
							<div
								className="h-16 w-16 bg-cover flex-shrink-0"
								style={{
									backgroundImage: `url(${playlist.images[0].url})`,
								}}></div>
							<div className="truncate flex-shrink ml-4">
								<div className="text-base truncate">{playlist.name}</div>
								<div className="truncate">{playlist.description}</div>
							</div>
						</div>
					))
				)}
			</div>
		</>
	);
}
