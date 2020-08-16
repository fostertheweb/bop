import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usernameState } from "atoms/username";
import { useSetRecoilState } from "recoil";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinnerThird,
  faCheck,
  faTimes,
} from "@fortawesome/pro-solid-svg-icons";
import { useDebounce } from "hooks/use-debounce";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Join() {
  const [username, setUsername] = useState();
  const { id: room } = useParams();
  const debounced = useDebounce(username, 500);
  const { status, isFetching, error } = useQuery(
    [debounced && "check", debounced],
    async (_, uid) => {
      const response = await fetch(
        `${API_BASE_URL}/rooms/${room}/check-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: uid }),
        },
      );
      return await response.json();
    },
    { enabled: debounced },
  );
  const saveUsername = useSetRecoilState(usernameState);

  console.log({ status });
  console.log({ isFetching });

  return (
    <div className="p-4 flex items-center">
      <div className="cq-bg-darker flex items-center border-2 border-gray-700 text-base rounded focus-within:border-green-500 focus-within:bg-gray-800 w-full text-gray-200">
        <input
          className="appearance-none bg-transparent text-base rounded px-4 py-2 pl-2 focus:outline-none w-full text-gray-200"
          id="displayName"
          placeholder="Your display name"
          autoComplete="false"
          onChange={(e) => setUsername(e.target.value)}
        />

        <FontAwesomeIcon
          icon={isFetching ? faSpinnerThird : error ? faTimes : faCheck}
          className="text-gray-500 fill-current m-2"
          spin={isFetching}
        />
      </div>
      <div className="w-4"></div>
      <button className="px-6 py-3 rounded bg-green-500 text-white font-medium hover:bg-green-600">
        Join
      </button>
    </div>
  );
}
