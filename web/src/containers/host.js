import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useUserDetails } from "hooks/use-user-details";
import { useCreateRoom } from "hooks/use-create-room";
import { useSetIsHost } from "hooks/use-is-host";

export default function Host() {
  const { userDetails } = useUserDetails();
  const [createRoom, { status, data: room }] = useCreateRoom();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState({
    host: userDetails?.id,
    name: "",
    approval: false,
    remote: false,
  });
  const setIsHost = useSetIsHost();

  function handleInputChange({ target }) {
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setRoomDetails({
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
      {status === "loading" ? (
        <CreateRoomLoader />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center cq-text-white p-4">
          <form onSubmit={onSubmit} className="cq-text-white">
            <h2 className="text-lg">Create Room</h2>
            {/* Spotify user card, "Logged into Spotify as ____" */}
            <Input
              name="name"
              label="Room Name"
              onChange={handleInputChange}
              placeholder={`${roomDetails.id}'s Room`}
            />
            <Input
              name="host"
              label="Your username"
              placeholder={roomDetails.host}
              onChange={handleInputChange}
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

function Input({ label, name, onChange }) {
  return (
    <div>
      <label>
        <div>{label}</div>
        <input type="text" name={name} onChange={onChange} />
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
