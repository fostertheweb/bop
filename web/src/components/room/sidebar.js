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

export default function Sidebar() {
  return (
    <div className="bg-gray-200 p-2" style={{ width: "calc(60px + 2rem)" }}>
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
      className="text-gray-600 text-sm block p-2 mt-2 first:mt-0 text-center rounded cursor-pointer hover:text-gray-700 transition ease-in-out duration-150"
      activeClassName="bg-gray-100"
      activeStyle={{ color: accentColor }}>
      <FontAwesomeIcon icon={icon} className="fill-current" size="lg" />

      <div className="mt-1">{children}</div>
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
