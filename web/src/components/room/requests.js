import React, { useEffect } from "react";
import { useQueue } from "hooks/use-queue";
import { useSongRequests, songRequestsState } from "hooks/use-song-requests";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinnerThird,
  faPlusCircle,
  faTimesCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { useParams } from "react-router";
import { useQuery } from "react-query";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Requests() {
  const { id: room } = useParams();
  const { removeSongRequest } = useSongRequests();
  const { add } = useQueue();
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
    return <FontAwesomeIcon icon={faSpinnerThird} spin size="lg" />;
  }

  return (
    <>
      <h1 className="p-4 text-lg font-medium tracking-wide text-gray-500">
        Song Requests
      </h1>
      {requests?.map((item, index) => {
        return (
          <motion.div
            key={item.id}
            className="flex items-center justify-between w-full p-2 text-left opacity-0 cursor-pointer hover:bg-gray-800"
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
                  className="w-10 h-10 shadow"
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
                onClick={() => add(item)}
                className="flex flex-col items-center px-4 py-2 text-green-700 hover:text-green-500">
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  className="mr-1 fill-current"
                  size="lg"
                />
              </button>
              <button
                onClick={() => removeSongRequest(index)}
                className="flex flex-col items-center px-4 py-2 text-red-800 hover:text-red-600">
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="mr-1 fill-current"
                  size="lg"
                />
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
