import React, { useContext, useState, useEffect } from "react";

export const QueueContext = React.createContext([]);

export function QueueProvider({ children }) {
	const queue = useQueueProvider();
	return (
		<QueueContext.Provider value={queue}>{children}</QueueContext.Provider>
	);
}

export function useQueue() {
	return useContext(QueueContext);
}

export function useQueueProvider() {
	const [queue, setQueue] = useState(getQueueFromStorage());

	useEffect(() => {
		localStorage.setItem("crowdQ.queue", JSON.stringify(queue));
	}, [queue]);

	function addToQueue(item) {
		setQueue([...queue, item]);
	}

	function removeFromQueue(index) {
		setQueue([...queue.slice(0, index), ...queue.slice(index + 1)]);
	}

	return { queue, addToQueue, removeFromQueue };
}

function getQueueFromStorage() {
	const cache = localStorage.getItem("crowdQ.queue");

	if (cache) {
		return JSON.parse(cache);
	}

	return [];
}
