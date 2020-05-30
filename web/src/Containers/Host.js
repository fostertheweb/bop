import React, { useEffect } from "react";
import { NavLink, Outlet, Routes, Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic, faSearch, faCog } from "@fortawesome/pro-solid-svg-icons";
import io from "socket.io-client";
import { useQueue, QueueProvider } from "../hooks/useQueue";
import { PlaylistsProvider } from "../hooks/usePlaylists";
import { PlayerProvider } from "../hooks/usePlayer";
import { useRecoilValueLoadable } from "recoil";

import Queue from "../Components/Queue";
import Search from "../Components/Search";
import Playlists from "../Components/Playlists";
import Settings from "../Components/Settings";
import Player from "../Components/Player";
import Playlist from "../Components/Playlist";
import { userDetailsSelector } from "../atoms/user-details";

const socket = io(`http://localhost:4000`);

export default function Host() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<QueueProvider>
						<PlayerProvider>
							<Layout />
						</PlayerProvider>
					</QueueProvider>
				}>
				<Route path="search" element={<Search />} />
				<Route
					path="playlists"
					element={
						<PlaylistsProvider>
							<Playlists />
						</PlaylistsProvider>
					}
				/>
				<Route
					path="playlists/:playlistId"
					element={
						<PlaylistsProvider>
							<Playlist />
						</PlaylistsProvider>
					}
				/>
				<Route path="settings" element={<Settings />} />
			</Route>
		</Routes>
	);
}

function Layout() {
	const { queue, addToQueue } = useQueue();
	const userDetails = useRecoilValueLoadable(userDetailsSelector);

	useEffect(() => {
		if (userDetails) {
			const { id: room } = userDetails;
			socket.emit("join", { room, user: room });
		}
	}, [userDetails]);

	useEffect(() => {
		socket.on("clap", (payload) => {
			console.log({ payload });
		});

		socket.on("joined", (payload) => {
			console.log({ payload });
		});

		socket.on("addToQueue", (item) => {
			addToQueue(item);
		});
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (userDetails) {
			socket.emit("queueUpdated", { room: userDetails.id, payload: queue });
		}
	}, [queue, userDetails]);

	switch (userDetails.state) {
		case "loading":
			return "loading...";
		default:
			console.log(userDetails.contents);
			break;
	}

	return (
		<>
			<div className="flex bg-gray-800 h-content overflow-hidden">
				<Sidebar />
				<div className="w-1/2 overflow-y-scroll">
					<Outlet />
				</div>
				<div className="flex-grow bg-gray-900 overflow-y-scroll">
					<Queue />
				</div>
			</div>
			<Player />
		</>
	);
}

function SidebarLink({ path, icon, children }) {
	return (
		<NavLink
			to={path}
			className="text-gray-500 block mt-2 text-center p-2 rounded cursor-pointer hover:text-gray-200 transition ease-in-out duration-150"
			activeClassName="text-teal-300 font-medium">
			<FontAwesomeIcon icon={icon} size="lg" className="fill-current" />
			<div className="mt-1 text-sm">{children}</div>
		</NavLink>
	);
}

function Sidebar() {
	return (
		<div className="bg-gray-950 flex flex-col" style={{ width: "80px" }}>
			<SidebarLink path="search" icon={faSearch}>
				Search
			</SidebarLink>
			<SidebarLink path="playlists" icon={faListMusic}>
				Playlists
			</SidebarLink>
			<SidebarLink path="settings" icon={faCog}>
				Settings
			</SidebarLink>
		</div>
	);
}
