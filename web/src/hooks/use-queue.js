import { useRecoilState } from "recoil";
import { playQueueAtom } from "../atoms/play-queue";

export function useQueue() {
	const [queue, setQueue] = useRecoilState(playQueueAtom);

	function addToQueue(item) {
		setQueue([...queue, item]);
	}

	function removeFromQueue(index) {
		setQueue([...queue.slice(0, index), ...queue.slice(index + 1)]);
	}

	return { queue, addToQueue, removeFromQueue };
}
