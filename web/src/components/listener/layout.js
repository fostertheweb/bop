import React from "react";
import { Outlet } from "react-router";
import Queue from "components/listener/queue";
import ListenerPlayer from "components/listener/player";
import { ListenerSidebar } from "components/listener/sidebar";

export default function ListenerLayout() {
	return (
		<>
			<div className="flex cq-bg h-content overflow-hidden">
				<ListenerSidebar />
				<div className="w-1/2 overflow-y-scroll hide-native-scrollbar">
					<Outlet />
				</div>
				<div className="flex-grow cq-bg-darker overflow-y-scroll hide-native-scrollbar">
					<Queue />
				</div>
			</div>
			<ListenerPlayer />
		</>
	);
}
