import React, { useState } from "react";
import Modal from "components/modal";
import { LoginButton as SpotifyButton } from "components/spotify/login-button";
import { LoginButton as DiscordButton } from "components/discord/login-button";

export default function Start() {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center">
      Add CrowdQ to Discord
      <button onClick={() => setOpen(true)}>Login</button>
      <Modal show={isOpen}>
        <SpotifyButton />
        <DiscordButton />
        <button
          onClick={() => setOpen(false)}
          className="w-full px-6 py-4 font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400">
          Cancel
        </button>
      </Modal>
    </div>
  );
}
