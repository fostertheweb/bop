import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { userDetailsSelector } from "../atoms/user-details";
import { userPlaylistsQuery } from "../atoms/playlists";

export function usePlaylists() {
	const userDetails = useRecoilValue(userDetailsSelector);
	return useRecoilValueLoadable(userPlaylistsQuery(userDetails.id));
}
