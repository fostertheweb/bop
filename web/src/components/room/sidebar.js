import React from "react";
import {
  faSearch,
  faListMusic,
  faUsers,
  faCog,
  faCommentMusic,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useDarkAccentColor } from "hooks/use-accent-color";

export default function Sidebar() {
  return (
    <div className="p-2 bg-gray-200" style={{ width: "calc(60px + 2rem)" }}>
      <SidebarLink path="search" icon={faSearch}>
        Search
      </SidebarLink>
      <SidebarLink path="playlists" icon={faListMusic}>
        Playlists
      </SidebarLink>
    </div>
  );
}

export function SidebarLink({ path, icon, children }) {
  const accentColor = useDarkAccentColor();
  return (
    <NavLink
      to={path}
      className="block p-2 mt-2 text-sm text-center text-gray-600 transition duration-150 ease-in-out rounded cursor-pointer first:mt-0 hover:text-gray-700"
      activeClassName="bg-gray-100"
      activeStyle={{ color: accentColor }}>
      <FontAwesomeIcon icon={icon} className="fill-current" size="lg" />

      <div className="mt-1">{children}</div>
    </NavLink>
  );
}
