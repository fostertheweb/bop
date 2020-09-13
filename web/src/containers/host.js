import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useQuery } from "react-query";
import { useSetIsHost } from "hooks/use-is-host";
import { useUserDetails } from "hooks/use-user-details";
import { useSetUsername } from "hooks/use-username";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Host() {
  const { userDetails } = useUserDetails();
  const setUsername = useSetUsername();
  const { status, data } = useQuery(
    ["createRoom", userDetails],
    async (_, details) => {
      setUsername(details.id);
      const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: "POST",
        body: JSON.stringify({ username: details.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    },
    { enabled: userDetails?.id },
  );
  const navigate = useNavigate();
  const setIsHost = useSetIsHost();

  useEffect(() => {
    if (data?.id) {
      setIsHost(true);
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
