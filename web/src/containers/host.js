import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useUserDetails } from "hooks/use-user-details";
import { useCreateRoom } from "hooks/use-create-room";
import { useSetIsHost } from "hooks/use-is-host";
import { useSetUsername } from "hooks/use-username";

export default function Host() {
  const { status: userStatus, data: userDetails } = useUserDetails();
  const [createRoom, { status, data: room }] = useCreateRoom();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState({
    host: userDetails?.id,
    name: "",
    approval: false,
    remote: false,
  });
  const setIsHost = useSetIsHost();
  const setUsername = useSetUsername();

  console.log(userDetails);

  function handleInputChange({ target }) {
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setRoomDetails({
      ...roomDetails,
      [name]: value,
    });
  }

  function onSubmit(event) {
    event.preventDefault();
    createRoom(roomDetails);
  }

  useEffect(() => {
    if (room?.id) {
      setIsHost(true);
      navigate(`/rooms/${room.id}/search`);
    }
    // eslint-disable-next-line
  }, [status]);

  return (
    <div className="h-screen flex items-center">
      {userStatus === "loading" ? (
        <CenteredLoader message="butt" />
      ) : status === "loading" ? (
        <CenteredLoader message="Creating a room for you and your listeners." />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center cq-text-white p-4">
          <form onSubmit={onSubmit} className="cq-text-white">
            <h2 className="text-lg">Create Room</h2>
            {/* Spotify user card, "Logged into Spotify as ____" */}
            <Input
              name="name"
              label="Room Name"
              onChange={handleInputChange}
              placeholder={`${userDetails?.id}'s Room`}
            />
            <Input
              name="username"
              label="Your username"
              placeholder={userDetails?.id}
              onChange={({ target }) => setUsername(target.value)}
            />
            <Option
              name="remote"
              label="Allow remote listening"
              onChange={handleInputChange}
            />
            <Option
              name="approval"
              label="Require song request approval"
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white hover:bg-teal-600 font-medium">
              Create Room
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label>
        <div>{label}</div>
        <input type="text" {...props} />
      </label>
    </div>
  );
}

function Option({ label, name, onChange }) {
  return (
    <div>
      <label>
        <input type="checkbox" name={name} onChange={onChange} /> {label}
      </label>
    </div>
  );
}

function CenteredLoader({ message }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center cq-text-white p-4">
      <FontAwesomeIcon
        icon={faSpinnerThird}
        className="fill-current"
        size="lg"
        spin
      />
      <div>{message}</div>
    </div>
  );
}
