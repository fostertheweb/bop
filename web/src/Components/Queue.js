import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useQueue } from "../hooks/use-queue";
import { usePlayer, PlayerProvider } from "../hooks/usePlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic } from "@fortawesome/pro-solid-svg-icons";

export default function Queue(props) {
	return (
		<PlayerProvider>
			<QueueContents {...props} />
		</PlayerProvider>
	);
}

function QueueContents() {
	const { queue, removeFromQueue } = useQueue();
	const { isPlaying, playOrPause } = usePlayer();

	useEffect(() => {
		const isFirstTrack = queue.length === 1;

		if (isFirstTrack && !isPlaying) {
			playOrPause(queue[0].uri);
		}

		//eslint-disable-next-line
	}, [queue]);

	return (
		<div className="bg-gray-900">
			<div className="pt-6 pb-4 pl-4 text-base text-gray-600">
				<FontAwesomeIcon icon={faListMusic} className="mr-2 fill-current" />
				<span className="border-b-2 border-transparent">Play Queue</span>
			</div>
			{queue?.map((item, index) => {
				return (
					<motion.div
						key={item.id}
						onClick={() => removeFromQueue(index)}
						className="text-left p-2 flex items-center w-full border-t border-gray-700 opacity-0 cursor-pointer hover:bg-gray-800"
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: "spring", stiffness: 300, damping: 200 },
							opacity: { duration: 0.2 },
						}}>
						<div className="p-2">
							<img
								src={item.album.images[2].url}
								alt="album art"
								className="shadow w-10 h-10"
							/>
						</div>
						<div className="ml-1">
							<div className="text-gray-400">{item.name}</div>
							<div className="text-gray-500">
								{item.artists.map((artist) => artist.name).join(", ")}
							</div>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}

const variants = {
	enter: (direction) => {
		return {
			x: direction > 0 ? 500 : -500,
			opacity: 0,
		};
	},
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1,
	},
	exit: (direction) => {
		return {
			zIndex: 0,
			x: direction < 0 ? 500 : -500,
			opacity: 0,
		};
	},
};
