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
import { useRemoteQueue } from "hooks/use-remote-queue";

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
        {rows.map((row, i) => {
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
  const { addToQueue } = useRemoteQueue();
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

  return (
    <>
      {data.map((track, i) => {
        return (
          <tr
            {...rowProps}
            key={`${rowProps.key}-expanded-${i}`}
            className="hover:bg-blue-100"
            onClick={() => addToQueue(track)}>
            {row.cells.map((cell) => {
              return (
                <td {...cell.getCellProps()} className="p-2 cursor-pointer">
                  {cell.render(cell.column.SubCell ? "SubCell" : "Cell", {
                    value:
                      cell.column.accessor && cell.column.accessor(track, i),
                    row: { ...row, original: track },
                  })}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

// IGNORE BELOW, ref for markup

export function OldPlaylists() {
  const { data: userDetails } = useUserDetails();
  const { isFetching: loading, data: playlists } = usePlaylists(userDetails);

  return (
    <>
      <h1 className="p-4 font-medium text-lg tracking-wide">Playlists</h1>
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
      className="p-2 text-gray-400 flex items-center cursor-pointer hover:bg-gray-100 transition ease-in-out duration-150 border-b border-gray-200">
      <div
        className="h-12 w-12 bg-cover flex-shrink-0"
        style={{
          backgroundImage: `url(${playlist.images[0].url})`,
        }}></div>
      <div className="truncate flex-shrink ml-4">
        <div className="text-base truncate text-gray-700">{playlist.name}</div>
        <div className="truncate text-gray-500">{playlist.description}</div>
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
        <h1 className="text-center text-gray-500 font-medium text-lg tracking-wide">
          {playlist.name}
        </h1>
        <span>&nbsp;</span>
      </div>
      <div>
        {items.map((item) => (
          <div className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 transition ease-in-out duration-150">
            <div className="">
              <img
                src={item.track.album.images[2].url}
                alt="album art"
                className="shadow h-10 w-10"
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
