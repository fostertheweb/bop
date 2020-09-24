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
import { useIsHost } from "hooks/use-is-host";
import { useDarkAccentColor } from "hooks/use-accent-color";
import { readableColor } from "polished";

export default function Sidebar() {
  return (
    <div className="flex flex-col bg-gray-200 p-2" style={{ width: "80px" }}>
      <SidebarLink path="search" icon={faSearch}>
        Search
      </SidebarLink>
      <SidebarLink path="playlists" icon={faListMusic}>
        Playlists
      </SidebarLink>
      <HostOnlyLink path="requests" icon={faCommentMusic}>
        Requests
      </HostOnlyLink>
      <SidebarLink path="listeners" icon={faUsers}>
        Listeners
      </SidebarLink>
      <HostOnlyLink path="settings" icon={faCog}>
        Settings
      </HostOnlyLink>
    </div>
  );
}

export function SidebarLink({ path, icon, children }) {
  const accentColor = useDarkAccentColor();
  return (
    <NavLink
      to={path}
      className="text-gray-600 font-medium block mt-2 text-center py-2 rounded cursor-pointer hover:text-gray-700 transition ease-in-out duration-150"
      activeClassName="bg-gray-100"
      activeStyle={{ color: accentColor }}>
      <FontAwesomeIcon icon={icon} size="lg" className="fill-current" />
      <div className="mt-1 text-xs">{children}</div>
    </NavLink>
  );
}

function HostOnlyLink(props) {
  const isHost = useIsHost();

  if (isHost) {
    return (
      <SidebarLink path={props.path} icon={props.icon}>
        {props.children}
      </SidebarLink>
    );
  }

  return null;
}
