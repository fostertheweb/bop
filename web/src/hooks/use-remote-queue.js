import io from "socket.io-client";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { displayNameState } from "atoms/display-name";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;
const socket = io(API_BASE_URL);

export function useRemoteQueue() {
	const displayName = useRecoilValue(displayNameState);
	const { room } = useParams();

	function addToQueue(item) {
		console.log({ emit: "addToQueue", arg: item });
		socket.emit("addToQueue", { room, user: displayName, payload: item });
	}

	return { addToQueue };
}
