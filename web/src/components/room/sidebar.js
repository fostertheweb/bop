import React from "react";
import {
  faSearch,
  faListMusic,
  faSpinnerThird,
  faHeart,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useAccentColors } from "hooks/use-vibrant";
import { useRoom } from "hooks/use-rooms";

export default function Sidebar() {
  const { id } = useParams();
  return (
    <div className="flex flex-col gap-2 p-2 text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-600">
      <DiscordLink path={`/rooms/${id}`} />
      <SidebarLink path="search" icon={faSearch}>
        Search
      </SidebarLink>
      <SidebarLink path="likes" icon={faHeart}>
        Liked
      </SidebarLink>
      <SidebarLink path="playlists" icon={faListMusic}>
        Playlists
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
  if (!room) return null;

  return (
    <NavLink
      to={path}
      className="flex items-center justify-center text-sm text-center transition duration-150 ease-in-out rounded cursor-pointer">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <img
            src={room.icon_url}
            width="56"
            height="56"
            alt="Discord Server Icon"
            className="rounded shadow filter hover:brightness-110"
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
  const color = darkAccent === "initial" ? "initial" : darkAccent;

  return (
    <NavLink
      to={path}
      className="block p-2 text-sm text-center transition duration-150 ease-in-out rounded cursor-pointer hover:text-gray-700 dark:hover:text-gray-100"
      activeClassName="bg-white dark:bg-gray-700 dark:text-gray-300"
      activeStyle={{ color }}>
      <FontAwesomeIcon icon={icon} className="fill-current" size="lg" />
      <div className="mt-1">{children}</div>
    </NavLink>
  );
}
