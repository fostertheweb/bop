import React from "react";
import {
	faSearch,
	faListMusic,
	faUsers,
	faCog,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
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

export function ListenerSidebar() {
	return (
		<div className="cq-bg-darker flex flex-col" style={{ width: "80px" }}>
			<SidebarLink path="search" icon={faSearch}>
				Search
			</SidebarLink>
		</div>
	);
}

export function SidebarLink({ path, icon, children }) {
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
