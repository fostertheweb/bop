import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/pro-solid-svg-icons";
import { useUserDetails } from "hooks/use-user-details";
import { usePlaylists } from "hooks/use-playlists";
import { useTable, useExpanded } from "react-table";
import { useQuery } from "react-query";
import Axios from "axios";
import { useRecoilValue } from "recoil";
import { userAccessTokenState } from "hooks/use-login";
import { useQueue } from "hooks/use-queue";
import { LoginButton } from "components/spotify/login-button";
import { faUserLock } from "@fortawesome/pro-duotone-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export default function Playlists() {
  const { data: user, status: userStatus } = useUserDetails();
  const { status: playlistsStatus, data: playlists } = usePlaylists(user);

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row, rowProps, visibleColumns }) => (
      <SubRowAsync
        row={row}
        rowProps={rowProps}
        visibleColumns={visibleColumns}
      />
    ),
    [],
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Playlists",
        columns: [
          {
            Header: "Name",
            accessor: (p) => p.name,
            Cell: ({ row }) => (
              <div className="flex items-center">
                <div
                  className="flex-shrink-0 w-16 h-16 bg-cover rounded"
                  style={{
                    backgroundImage: `url(${row.original.images[0].url})`,
                  }}></div>
                <div className="ml-4">
                  <div className="text-base text-gray-800">
                    {row.original.name}
                  </div>
                  <div
                    className="text-sm text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: row.original.description,
                    }}></div>
                </div>
              </div>
            ),
            SubCell: (cellProps) => {
              console.log({ cellProps });
              return <>{cellProps.value}</>;
            },
          },
        ],
      },
      {
        id: "expander",
        Header: () => null,
        Cell: ({ row }) => (
          <span>
            {row.isExpanded ? (
              <FontAwesomeIcon
                icon={faChevronDown}
                className="text-gray-500 fill-current"
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-gray-400 fill-current"
              />
            )}
          </span>
        ),
        SubCell: () => null,
      },
    ],
    [],
  );

  if (userStatus === "loading") {
    return "Fetching Spotify User Details";
  }

  if (playlistsStatus === "loading") {
    return `Fetching Spotify Playlists for ${user.id}`;
  }

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between w-full p-4 text-base text-gray-600 bg-white">
        <div className="flex items-center border-2 border-transparent">
          <div>
            <FontAwesomeIcon
              icon={faSpotify}
              className="mr-2 text-gray-500 fill-current"
              size="lg"
            />
            <span>{user ? `${user.id}'s` : null} Spotify Playlists</span>
          </div>
        </div>
      </div>
      {user ? (
        <PlaylistsTable
          columns={columns}
          data={playlists.items}
          renderRowSubComponent={renderRowSubComponent}
        />
      ) : (
        <NotLoggedIn />
      )}
    </>
  );
}

function PlaylistsTable({ columns, data, renderRowSubComponent }) {
  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable(
    {
      columns,
      data,
    },
    useExpanded,
  );

  return (
    <table {...getTableProps()} className="w-full">
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const rowProps = row.getRowProps();
          return (
            // Use a React.Fragment here so the table markup is still valid
            <React.Fragment key={row.id}>
              <tr
                {...rowProps}
                {...row.getToggleRowExpandedProps()}
                className="text-gray-700 hover:bg-blue-100">
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="p-2">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
              {/*
                If the row is in an expanded state, render a row with a
                column that fills the entire length of the table.
              */}
              {row.isExpanded ? (
                <tr>
                  <td colSpan={visibleColumns.length}>
                    {/*
                      Inside it, call our renderRowSubComponent function. In reality,
                      you could pass whatever you want as props to
                      a component like this, including the entire
                      table instance. But for this example, we'll just
                      pass the row
                    */}
                    {renderRowSubComponent({ row, rowProps, visibleColumns })}
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

function SubRowAsync({ row, rowProps, visibleColumns }) {
  const { add } = useQueue();
  const {
    original: { id },
  } = row;
  const userAccessToken = useRecoilValue(userAccessTokenState);
  const { data, status } = useQuery(id && ["playlist", id], async () => {
    const { data } = await Axios.get(
      `${SPOTIFY_API_URL}/playlists/${id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );
    return data.items.map((i) => i.track);
  });

  if (status === "loading" || !data) {
    return (
      <tr>
        <td />
        <td colSpan={visibleColumns.length - 1}>Loading...</td>
      </tr>
    );
  }

  // Render the UI for your table
  return (
    <>
      <div className="flex text-xs text-gray-700">
        <div style={{ width: "30%" }} className="p-1 font-medium">
          Name
        </div>
        <div style={{ width: "30%" }} className="p-1 font-medium">
          Artist
        </div>
        <div style={{ width: "30%" }} className="p-1 font-medium">
          Album
        </div>
        <div style={{ width: "10%" }} className="p-1 font-medium">
          Duration
        </div>
      </div>
      {data.map((track, i) => {
        return (
          <div
            {...rowProps}
            key={`${rowProps.key}-expanded-${i}`}
            className="flex items-center w-full text-xs text-gray-800 cursor-pointer hover:bg-purple-200"
            onClick={() => add(track.id)}>
            <div style={{ width: "30%" }} className="p-1 truncate">
              {track.name}
            </div>
            <div style={{ width: "30%" }} className="p-1 truncate">
              {track.artists[0].name}
            </div>
            <div style={{ width: "30%" }} className="p-1 truncate">
              {track.album.name}
            </div>
            <div style={{ width: "10%" }} className="p-1">
              {millisToMinutesAndSeconds(track.duration_ms)}
            </div>
          </div>
        );
      })}
    </>
  );
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function NotLoggedIn() {
  return (
    <div className="flex items-center justify-center flex-grow text-gray-600">
      <div
        className="flex flex-col items-center gap-4 p-8"
        style={{ width: "24rem" }}>
        <FontAwesomeIcon
          icon={faUserLock}
          className="text-gray-500 fill-current"
          size="4x"
        />

        <h3 className="text-lg font-medium text-gray-700">
          Not logged in to Spotify
        </h3>

        <div className="mt-4 text-gray-700">
          Login with your Spotify account to view your Playlists and save songs
          you like.
        </div>
        <div className="w-full">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
