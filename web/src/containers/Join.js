import React from "react";
import { Link } from "react-router-dom";
import { displayNameState } from "atoms/display-name";
import { useSetRecoilState } from "recoil";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Join() {
  const setDisplayName = useSetRecoilState(displayNameState);
  const { status, data } = useQuery("rooms", async () => {
    const response = await fetch(`${API_BASE_URL}/rooms`);
    return await response.json();
  });

  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <div className="w-2/3">
        <div className="cq-bg-darker flex items-center border-2 border-gray-700 text-base rounded focus-within:border-green-500 focus-within:bg-gray-800 w-full text-gray-200">
          <input
            className="appearance-none bg-transparent text-base rounded px-4 py-2 pl-2 focus:outline-none w-full text-gray-200"
            id="displayName"
            placeholder="Your display name"
            autoComplete="false"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <h1 className="text-xl cq-text-white py-4">Active Sessions</h1>
        {status === "loading" ? (
          <FontAwesomeIcon icon={faSpinnerThird} />
        ) : (
          data.map((room) => <Room name={room} />)
        )}
      </div>
    </div>
  );
}

function Room({ name }) {
  return (
    <div className="w-full px-6 py-3 text-white bg-gray-700 border border-gray-600 flex items-center justify-between rounded shadow">
      <div>{name}</div>
      <Link
        to={`/listen/${name}`}
        className="px-6 py-3 rounded bg-green-500 text-white font-medium hover:bg-green-600">
        Join
      </Link>
    </div>
  );
}
