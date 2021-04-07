import React, { useEffect } from "react";
import { listenersState } from "hooks/use-listeners";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useParams } from "react-router";
import { useQuery } from "react-query";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Listeners() {
  const { id: room } = useParams();
  const [listeners, setListeners] = useRecoilState(listenersState);
  const { status, isFetching, data } = useQuery(
    ["listeners", room],
    async (_, id) => {
      const response = await fetch(`${API_BASE_URL}/rooms/${id}/listeners`);
      return await response.json();
    },
  );

  useEffect(() => {
    if (data) {
      setListeners(data);
    }
    //eslint-disable-next-line
  }, [status]);

  if (isFetching) {
    return <FontAwesomeIcon icon={faSpinnerThird} size="lg" />;
  }

  return (
    <>
      <h1 className="p-4 cq-text-white font-medium text-lg tracking-wide">
        Listeners
      </h1>
      {listeners?.map((listener) => {
        return (
          <motion.div
            key={listener}
            className="text-left p-2 flex items-center justify-between w-full opacity-0 cursor-pointer hover:bg-gray-800"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 200 },
              opacity: { duration: 0.2 },
            }}>
            {listener}
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
