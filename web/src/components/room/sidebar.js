import React from "react";
import {
  faSearch,
  faListMusic,
  faSpinnerThird,
  faSlidersHSquare,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useAccentColors } from "hooks/use-vibrant";
import { useRoom } from "hooks/use-rooms";

export default function Sidebar() {
  const { id } = useParams();
  return (
    <div className="p-2 bg-gray-200">
      <DiscordLink path={`/rooms/${id}`} />
      <SidebarLink path="search" icon={faSearch}>
        Search
      </SidebarLink>
      <SidebarLink path="playlists" icon={faListMusic}>
        Playlists
      </SidebarLink>
      <SidebarLink path="settings" icon={faSlidersHSquare}>
        Settings
      </SidebarLink>
    </div>
  );
}

function DiscordLink({ path }) {
  const { data: room, status } = useRoom();
  const { darkAccent } = useAccentColors();
  const location = useLocation();
  const active = location.pathname === path;
  const boxShadowColor = darkAccent === "initial" ? "#718096" : darkAccent;

  if (status === "loading") {
    return <FontAwesomeIcon icon={faSpinnerThird} spin color={darkAccent} />;
  }

  return (
    <NavLink
      to={path}
      className="flex items-center justify-center mt-2 text-sm text-center text-gray-600 transition duration-150 ease-in-out rounded cursor-pointer first:mt-0 hover:text-gray-700">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <img
            src={room.icon_url}
            width="56"
            height="56"
            alt="Discord Server Icon"
            className="rounded shadow"
            style={
              active
                ? {
                    boxShadow: `0px 0px 0px 4px ${boxShadowColor}`,
                  }
                : null
            }
          />
        </div>
      </div>
    </NavLink>
  );
}

export function SidebarLink({ path, icon, children }) {
  const { darkAccent } = useAccentColors();
  return (
    <NavLink
      to={path}
      className="block p-2 mt-2 text-sm text-center text-gray-600 transition duration-150 ease-in-out rounded cursor-pointer first:mt-0 hover:text-gray-700"
      activeClassName="bg-white text-gray-900 dark:bg-black dark:text-gray-500"
      activeStyle={{ color: darkAccent }}>
      <FontAwesomeIcon icon={icon} className="fill-current" size="lg" />
      <div className="mt-1">{children}</div>
    </NavLink>
  );
}
