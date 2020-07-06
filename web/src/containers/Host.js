import React, { useEffect } from "react";
import { NavLink, Outlet, Routes, Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic, faSearch, faCog } from "@fortawesome/pro-solid-svg-icons";
import io from "socket.io-client";
import { useQueue } from "hooks/use-queue";
import { useRecoilValueLoadable } from "recoil";

import Queue from "components/Queue";
import Search from "components/Search";
import Playlists from "components/Playlists";
import Settings from "components/Settings";
import Player from "components/Player";
import Playlist from "components/Playlist";
import { userDetailsSelector } from "atoms/user-details";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons";
import ListenersList from "components/listeners";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

const socket = io(API_BASE_URL);

export default function Host() {
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

function Layout() {
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
			addToQueue(item);
		});
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (state === "hasValue") {
			socket.emit("queueUpdated", { room: contents.id, payload: queue });
		}
	}, [queue, state]);

	return (
		<>
			<div className="flex cq-bg h-content overflow-hidden">
				<Sidebar />
				<div className="w-1/2 overflow-y-scroll hide-native-scrollbar">
					<Outlet />
				</div>
				<div className="flex-grow cq-bg-darker overflow-y-scroll hide-native-scrollbar">
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
		<div className="cq-bg-darker flex flex-col" style={{ width: "80px" }}>
			<SidebarLink path="search" icon={faSearch}>
				Search
			</SidebarLink>
			<SidebarLink path="playlists" icon={faListMusic}>
				Playlists
			</SidebarLink>
			<SidebarLink path="listeners" icon={faUsers}>
				Listeners
			</SidebarLink>
			<SidebarLink path="settings" icon={faCog}>
				Settings
			</SidebarLink>
		</div>
	);
}
