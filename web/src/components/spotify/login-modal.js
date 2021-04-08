import React, { useState } from "react";
import Modal from "components/modal";
import { LoginButton } from "components/spotify/login-button";

export default function LoginModal(props) {
  return (
    <Modal {...props}>
      <div className="p-2">
        Login with your Spotify Premium account to view your Playlists and save
        songs you like.
      </div>
      <LoginButton />
    </Modal>
  );
}
