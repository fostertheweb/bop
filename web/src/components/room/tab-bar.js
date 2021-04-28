import React from "react";
import {
  faSearch,
  faListMusic,
  faSpinnerThird,
  faHeart,
  faAlbumCollection,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useAccentColors } from "hooks/use-vibrant";
import { useIsDarkMode } from "hooks/use-dark-mode";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

export default function TabBar() {
  const { id } = useParams();
  return (
    <div className="z-10 flex flex-row items-center w-full gap-2 p-1 text-gray-600 bg-gray-200 md:hidden dark:text-gray-300 dark:bg-gray-900">
      <DiscordTabBarItem path={`/rooms/${id}`} icon={faDiscord}>
        Details
      </DiscordTabBarItem>
      <TabBarItem path="queue" icon={faListMusic}>
        Queue
      </TabBarItem>
      <TabBarItem path="search" icon={faSearch}>
        Search
      </TabBarItem>
      <TabBarItem path="likes" icon={faHeart}>
        Liked
      </TabBarItem>
      <TabBarItem path="playlists" icon={faAlbumCollection}>
        Playlists
      </TabBarItem>
    </div>
  );
}

function DiscordTabBarItem({ path, icon, children }) {
  const isDarkMode = useIsDarkMode();
  const { darkAccent, lightAccent } = useAccentColors();
  const color = isDarkMode ? lightAccent : darkAccent;
  const location = useLocation();
  const active = location.pathname === path;

  return (
    <NavLink
      to={path}
      className={`${
        active ? "bg-white dark:bg-gray-800 dark:text-gray-300" : null
      } block w-1/5 p-1 text-sm text-center transition duration-150 ease-in-out rounded cursor-pointer hover:text-gray-700 dark:hover:text-gray-100`}
      style={active ? { color } : null}>
      <FontAwesomeIcon icon={icon} className="fill-current" size="lg" />
      <div className="mt-1">{children}</div>
    </NavLink>
  );
}

function TabBarItem({ path, icon, children }) {
  const isDarkMode = useIsDarkMode();
  const { darkAccent, lightAccent } = useAccentColors();
  const color = isDarkMode ? lightAccent : darkAccent;

  return (
    <NavLink
      to={path}
      className="block w-1/5 p-1 text-sm text-center transition duration-150 ease-in-out rounded cursor-pointer hover:text-gray-700 dark:hover:text-gray-100"
      activeClassName="bg-white dark:bg-gray-800 dark:text-gray-300"
      activeStyle={{ color }}>
      <FontAwesomeIcon icon={icon} className="fill-current" size="lg" />
      <div className="mt-1">{children}</div>
    </NavLink>
  );
}
