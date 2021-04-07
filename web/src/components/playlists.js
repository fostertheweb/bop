import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faSpinnerThird,
} from "@fortawesome/pro-solid-svg-icons";
import { useUserDetails } from "hooks/use-user-details";
import { usePlaylists } from "hooks/use-playlists";
import { useTable, useExpanded } from "react-table";
import { useQuery } from "react-query";
import Axios from "axios";
import { useRecoilValue } from "recoil";
import { userAccessTokenState } from "hooks/use-login";
import { useQueue } from "hooks/use-queue";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export default function Playlists() {
  const { data: userDetails } = useUserDetails();
  const { status, data: playlists } = usePlaylists(userDetails);

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
                  className="flex-shrink-0 w-16 h-16 bg-cover"
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

  if (status === "loading" || !playlists) {
    return <FontAwesomeIcon icon={faSpinnerThird} spin />;
  }

  return (
    <PlaylistsTable
      columns={columns}
      data={playlists.items}
      renderRowSubComponent={renderRowSubComponent}
    />
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
            <React.Fragment>
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
  const { addToQueue } = useQueue();
  const {
    original: { id },
  } = row;
  const userAccessToken = useRecoilValue(userAccessTokenState);
  const { data, status } = useQuery(id && ["playlist", id], async () => {
    const { data } = await Axios.get(
      `${SPOTIFY_API_BASE_URL}/playlists/${id}/tracks`,
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
            onClick={() => addToQueue(track)}>
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

// IGNORE BELOW, ref for markup

export function OldPlaylists() {
  const { data: userDetails } = useUserDetails();
  const { isFetching: loading, data: playlists } = usePlaylists(userDetails);

  return (
    <>
      <h1 className="p-4 text-lg font-medium tracking-wide">Playlists</h1>
      <div>
        {loading ? (
          <FontAwesomeIcon icon={faSpinnerThird} spin />
        ) : (
          playlists?.items?.map((playlist) => (
            <PlaylistListItem playlist={playlist} />
          ))
        )}
      </div>
    </>
  );
}

function PlaylistListItem({ playlist }) {
  return (
    <div
      onClick={() => console.log(playlist.id)}
      className="flex items-center p-2 text-gray-400 transition duration-150 ease-in-out border-b border-gray-200 cursor-pointer hover:bg-gray-100">
      <div
        className="flex-shrink-0 w-12 h-12 bg-cover"
        style={{
          backgroundImage: `url(${playlist.images[0].url})`,
        }}></div>
      <div className="flex-shrink ml-4 truncate">
        <div className="text-base text-gray-700 truncate">{playlist.name}</div>
        <div className="text-gray-500 truncate">{playlist.description}</div>
      </div>
    </div>
  );
}

export function Playlist() {
  const playlist = {};
  const items = [];
  return (
    <div>
      <div className="flex items-center justify-between p-4 text-gray-500">
        <h1 className="text-lg font-medium tracking-wide text-center text-gray-500">
          {playlist.name}
        </h1>
        <span>&nbsp;</span>
      </div>
      <div>
        {items.map((item) => (
          <div className="flex items-center px-4 py-2 transition duration-150 ease-in-out cursor-pointer hover:bg-gray-700">
            <div className="">
              <img
                src={item.track.album.images[2].url}
                alt="album art"
                className="w-10 h-10 shadow"
              />
            </div>
            <div className="ml-4">
              <div className="text-gray-400">{item.track.name}</div>
              <div className="text-gray-500">
                {item.track.artists.map(({ name }) => name).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
