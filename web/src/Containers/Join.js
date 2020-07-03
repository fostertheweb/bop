import React, { useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

const socket = io(API_BASE_URL);

export default function Join() {
	const [room, setRoom] = useState("brendan_mcdonald");
	const [name, setName] = useState("coolDude12");
	const navigate = useNavigate();

	const joinRoom = () => {
		socket.emit("join", { room, user: name });
	};

	const clap = () => {
		socket.emit("clap", { room, user: name });
	};

	socket.on("joined", () => {
		navigate(`/listen/${room}`);
	});

	return (
		<div className="flex flex-col justify-center h-screen w-full items-center">
			<input onChange={({ target }) => setName(target.value)} value={name} />
			<input onChange={({ target }) => setRoom(target.value)} value={room} />
			<button onClick={joinRoom}>join</button>
			<button onClick={clap}>clap</button>
		</div>
	);
}
