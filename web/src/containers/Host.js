import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { userDetailsSelector } from "atoms/user-details";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useQuery } from "react-query";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Host() {
  const { contents = null } = useRecoilValueLoadable(userDetailsSelector);
  const { status, data } = useQuery(
    ["createRoom", contents.id],
    async (_, username) => {
      const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: "POST",
        body: JSON.stringify({ username }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    },
    { enabled: contents.id },
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.id) {
      navigate(`/rooms/${data.id}/search`);
    }
    // eslint-disable-next-line
  }, [status]);

  return (
    <div className="h-screen flex items-center">
      <div className="w-full h-full flex flex-col items-center justify-center cq-text-white p-4">
        <FontAwesomeIcon
          icon={faSpinnerThird}
          className="fill-current"
          size="lg"
          spin
        />
        <div>
          {status === "loading"
            ? "Creating a room for you and your listeners."
            : ""}
        </div>
      </div>
    </div>
  );
}
