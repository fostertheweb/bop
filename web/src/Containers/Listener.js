import React, { useEffect, useState } from "react";
import Search from "../Components/Search";
import Queue from "../Components/Queue";
import { QueueProvider } from "../hooks/use-queue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic } from "@fortawesome/pro-solid-svg-icons";
import { useParams } from "react-router-dom";

import io from "socket.io-client";

const socket = io(`http://localhost:4000`);

export default function Listener() {
	const { room } = useParams();
	//eslint-disable-next-line
	const [_, setQueue] = useState([]);

	const addToQueue = ({ payload }) => {
		socket.emit("addToQueue", { room, payload });
	};

	useEffect(() => {
		socket.on("clap", (payload) => {
			console.log({ payload });
		});
	}, []);
	useEffect(() => {
		socket.on("joined", (payload) => {
			console.log({ payload });
		});
		socket.on("queueUpdate", (payload) => {
			setQueue(payload);
		});
	}, []);

	const clap = () => {
		socket.emit("clap", { room, user: "test" });
	};

	return (
		<>
			<QueueProvider>
				<header className="flex items-center justify-between bg-black p-1">
					<div className="tracking-wide text-gray-400 mx-2 font-medium">
						<FontAwesomeIcon
							icon={faListMusic}
							size="lg"
							className="text-pink-500 fill-current mr-2"
						/>
						<button onClick={clap}>clap</button>
					</div>
				</header>
				<div className="flex bg-gray-800 h-full">
					<div className="flex-grow">
						<div className="flex items-stretch">
							<div className="w-1/2 border-r border-gray-700 h-full overflow-y-scroll hide-native-scrollbar">
								<Queue dispatch={addToQueue} />
							</div>
							<div className="w-1/2 h-full overflow-y-scroll hide-native-scrollbar">
								<Search dispatch={addToQueue} />
							</div>
						</div>
					</div>
				</div>
			</QueueProvider>
		</>
	);
}
