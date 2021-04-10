import React from "react";
import {
  faSearch,
  faListMusic,
  faSpinnerThird,
  faGamepadAlt,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useDarkAccentColor } from "hooks/use-accent-color";
import { useRoom } from "hooks/use-rooms";

export default function Sidebar() {
  const { id } = useParams();
  return (
    <div className="p-2 bg-gray-200" style={{ width: "calc(48px + 2rem)" }}>
      <DiscordLink path={`/rooms/${id}`} />
      <SidebarLink path="search" icon={faSearch}>
        Search
      </SidebarLink>
      <SidebarLink path="playlists" icon={faListMusic}>
        Playlists
      </SidebarLink>
    </div>
  );
}

function DiscordLink({ path }) {
  const { id } = useParams();
  const { data: room, status } = useRoom(id);
  const accentColor = useDarkAccentColor();
  const location = useLocation();
  const active = location.pathname === path;
  console.log({ active });

  if (status === "loading") {
    return <FontAwesomeIcon icon={faSpinnerThird} spin color={accentColor} />;
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
                    boxShadow: `0px 0px 0px 4px ${accentColor || "#444"}`,
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
  const accentColor = useDarkAccentColor();
  return (
    <NavLink
      to={path}
      className="block p-2 mt-2 text-sm text-center text-gray-600 transition duration-150 ease-in-out rounded cursor-pointer first:mt-0 hover:text-gray-700"
      activeClassName="bg-gray-400 text-gray-900"
      activeStyle={{ color: accentColor }}>
      <FontAwesomeIcon icon={icon} className="fill-current" size="lg" />

      <div className="mt-1">{children}</div>
    </NavLink>
  );
}
