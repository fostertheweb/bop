import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinnerThird,
  faCheck,
  faTimes,
} from "@fortawesome/pro-solid-svg-icons";
import { useDebounce } from "hooks/use-debounce";
import { useSetIsHost } from "hooks/use-is-host";
import { useCheckUsername, useSetUsername } from "hooks/use-username";

export default function Join() {
  const { id: room } = useParams();
  const [text, setText] = useState();
  const debounced = useDebounce(text, 500);
  const checkUsername = useCheckUsername(debounced);
  const setUsername = useSetUsername();
  const navigate = useNavigate();
  const setIsHost = useSetIsHost();

  return (
    <div className="p-4 flex items-center justify-center">
      <div className="flex items-center border-2 border-gray-700 text-base rounded focus-within:border-green-500 focus-within:bg-gray-800 w-full text-gray-200">
        <input
          className="appearance-none bg-transparent text-base rounded px-4 py-2 pl-2 focus:outline-none w-full text-gray-200"
          id="displayName"
          placeholder="Your display name"
          autoComplete="false"
          onChange={(e) => setText(e.target.value)}
        />
        {text && text !== "" ? (
          <InputLookupStatus status={checkUsername} />
        ) : null}
      </div>
      <div className="w-4"></div>
      <button
        className="px-6 py-3 rounded bg-green-500 text-white font-medium hover:bg-green-600"
        disabled={!debounced || checkUsername === "error"}
        onClick={() => {
          setUsername(debounced);
          setIsHost(false);
          navigate(`/rooms/${room}/search`);
        }}>
        Join
      </button>
    </div>
  );
}

function InputLookupStatus({ status }) {
  switch (status) {
    case "loading":
      return (
        <FontAwesomeIcon
          icon={faSpinnerThird}
          className="text-gray-500 fill-current m-2"
          spin
        />
      );
    case "error":
      return (
        <FontAwesomeIcon
          icon={faTimes}
          className="text-red-500 fill-current m-2"
        />
      );
    case "success":
      return (
        <FontAwesomeIcon
          icon={faCheck}
          className="text-green-500 fill-current m-2"
        />
      );
    default:
      return null;
  }
}
