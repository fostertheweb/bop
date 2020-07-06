import React, { useEffect } from "react";
import Search from "components/Search";
import Queue from "components/Queue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic } from "@fortawesome/pro-solid-svg-icons";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { useRecoilValue } from "recoil";
import { displayNameState } from "atoms/display-name";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;
const socket = io(API_BASE_URL);

export default function Listener() {
	const displayName = useRecoilValue(displayNameState);
	const { room } = useParams();

	useEffect(() => {
		socket.emit("join", { room, user: displayName });
	}, []);

	return <div>Listening to the music</div>;
}
