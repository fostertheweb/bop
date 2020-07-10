import React, { useEffect } from "react";
import Search from "components/listener/search";
import io from "socket.io-client";
import {
	useRecoilValue,
	useRecoilValueLoadable,
	useSetRecoilState,
} from "recoil";
import { displayNameState } from "atoms/display-name";
import { Routes, Route, useParams } from "react-router-dom";
import ListenerLayout from "components/listener/layout";
import {
	clientAccessTokenQuery,
	clientAccessTokenState,
} from "atoms/client-access-token";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { playQueueAtom } from "atoms/play-queue";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;
const socket = io(API_BASE_URL);

export default function Listener() {
	const displayName = useRecoilValue(displayNameState);
	const { room } = useParams();
	const { state, contents } = useRecoilValueLoadable(clientAccessTokenQuery);
	const setClientAccessToken = useSetRecoilState(clientAccessTokenState);
	const setQueue = useSetRecoilState(playQueueAtom);

	socket.on("queueUpdated", ({ payload: queue }) => {
		console.log({ action: "queueUpdated", state: queue });
		setQueue(queue);
	});

	useEffect(() => {
		socket.emit("join", { room, user: displayName });
	}, []);

	useEffect(() => {
		if (state === "hasValue" && contents) {
			setClientAccessToken(contents.access_token);
		}
	}, [state, contents]);

	if (state === "loading") {
		return <FontAwesomeIcon spin icon={faSpinnerThird} />;
	}

	return (
		<Routes>
			<Route path="/" element={<ListenerLayout />}>
				<Route path="/" element={<Search />} />
			</Route>
		</Routes>
	);
}
