import React, { useEffect } from "react";
import { useRemoteQueue } from "hooks/use-remote-queue";
import { useSongRequests, songRequestsState } from "hooks/use-song-requests";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinnerThird,
  faListMusic,
  faTimesCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { useParams } from "react-router";
import { useQuery } from "react-query";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Requests() {
  const { id: room } = useParams();
  const { removeSongRequest } = useSongRequests();
  const { addToQueue } = useRemoteQueue();
  const [requests, setSongRequests] = useRecoilState(songRequestsState);
  const { status, isFetching, data } = useQuery(
    ["songRequests", room],
    async (_, id) => {
      const response = await fetch(`${API_BASE_URL}/rooms/${id}/requests`);
      return await response.json();
    },
    { refetchOnWindowFocus: false, refetchOnMount: false },
  );

  useEffect(() => {
    if (data) {
      setSongRequests(data);
    }
    //eslint-disable-next-line
  }, [status]);

  if (isFetching) {
    return <FontAwesomeIcon icon={faSpinnerThird} size="lg" />;
  }

  return (
    <>
      <h1 className="p-4 text-gray-500 font-medium text-lg tracking-wide">
        Song Requests
      </h1>
      {requests?.map((item, index) => {
        return (
          <motion.div
            key={item.id}
            className="text-left p-2 flex items-center justify-between w-full opacity-0 cursor-pointer hover:bg-gray-800"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 200 },
              opacity: { duration: 0.2 },
            }}>
            <div className="flex items-center">
              <div className="p-2">
                <img
                  src={item.album.images[2].url}
                  alt="album art"
                  className="shadow w-10 h-10"
                />
              </div>
              <div className="ml-1">
                <div className="text-gray-400">{item.name}</div>
                <div className="text-gray-500">
                  {item.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
            </div>
            <div className="flex">
              <button
                onClick={() => addToQueue(item)}
                className="flex items-center text-green-700 py-2 px-4 hover:text-green-500">
                <FontAwesomeIcon
                  icon={faListMusic}
                  className="fill-current mr-1"
                />
                Add
              </button>
              <button
                onClick={() => removeSongRequest(index)}
                className="flex items-center text-red-800 py-2 px-4 hover:text-red-600">
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="fill-current mr-1"
                />
                Remove Request
              </button>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    };
  },
};
