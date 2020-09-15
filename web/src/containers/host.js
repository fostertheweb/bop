import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useUserDetails } from "hooks/use-user-details";
import { useCreateRoom } from "hooks/use-create-room";

export default function Host() {
  const { userDetails } = useUserDetails();
  const [createRoom, { status, data }] = useCreateRoom();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.id) {
      navigate(`/rooms/${data.id}/search`);
    }
    // eslint-disable-next-line
  }, [status]);

  return (
    <div className="h-screen flex items-center">
      <form onSubmit={(e) => console.log(e)}>
        <input type="checkbox" />
      </form>
    </div>
  );
}

function CreateRoomLoader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center cq-text-white p-4">
      <FontAwesomeIcon
        icon={faSpinnerThird}
        className="fill-current"
        size="lg"
        spin
      />
      <div>Creating a room for you and your listeners.</div>
    </div>
  );
}
