import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import { useQueue } from "hooks/use-queue";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import Search from "components/host/search";
import Playlists from "components/Playlists";
import Settings from "components/host/settings";
import Playlist from "components/Playlist";
import { userDetailsSelector } from "atoms/user-details";
import ListenersList from "components/host/listeners";
import Layout from "components/host/layout";
import { playQueueAtom } from "atoms/play-queue";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

const socket = io(API_BASE_URL);

export default function Host() {
	const { queue, addToQueue } = useQueue();
	const { state, contents } = useRecoilValueLoadable(userDetailsSelector);

	useEffect(() => {
		if (state === "hasValue" && contents) {
			const { id: room } = contents;
			socket.emit("join", { room, user: room });
		}
	}, [state]);

	useEffect(() => {
		socket.on("joined", (payload) => {
			console.log({ payload });
		});

		socket.on("addToQueue", (item) => {
			console.log(item);
			addToQueue(item);
		});
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (contents?.id) {
			console.log("Updating queue for remote users.");
			socket.emit("queueUpdated", { room: contents.id, payload: queue });
		}
		//eslint-disable-next-line
	}, [queue]);

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="search" element={<Search />} />
				<Route path="playlists" element={<Playlists />} />
				<Route path="playlists/:playlistId" element={<Playlist />} />
				<Route path="listeners" element={<ListenersList />} />
				<Route path="settings" element={<Settings />} />
			</Route>
		</Routes>
	);
}
