import React from "react";
import { Outlet } from "react-router";
import Queue from "components/host/queue";
import Player from "components/host/player";
import Sidebar from "components/host/sidebar";

export default function Layout() {
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
