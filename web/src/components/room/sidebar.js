import React from "react";
import {
  faSearch,
  faListMusic,
  faUsers,
  faCog,
  faCommentMusic,
  faSpinnerThird,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { usernameState } from "atoms/username";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Sidebar() {
  const { id: room } = useParams();
  const { isFetching, data } = useQuery(
    ["room", room],
    async (_, id) => {
      const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
      return await response.json();
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  return (
    <div className="cq-bg-darker flex flex-col" style={{ width: "80px" }}>
      <SidebarLink path="search" icon={faSearch}>
        Search
      </SidebarLink>
      <SidebarLink path="playlists" icon={faListMusic}>
        Playlists
      </SidebarLink>
      <HostOnlyLink
        path="requests"
        icon={faCommentMusic}
        data={data}
        isFetching={isFetching}>
        Requests
      </HostOnlyLink>
      <SidebarLink path="listeners" icon={faUsers}>
        Listeners
      </SidebarLink>
      <HostOnlyLink
        path="settings"
        icon={faCog}
        data={data}
        isFetching={isFetching}>
        Settings
      </HostOnlyLink>
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

function HostOnlyLink(props) {
  const username = useRecoilValue(usernameState);

  if (props.isFetching) {
    return (
      <div className="block mt-2 p-2 text-center">
        <FontAwesomeIcon
          icon={faSpinnerThird}
          spin
          size="lg"
          className="cq-text-white"
        />
      </div>
    );
  }

  if (props.data[1] && username === props.data[1]) {
    return (
      <SidebarLink path={props.path} icon={props.icon}>
        {props.children}
      </SidebarLink>
    );
  }

  return null;
}
