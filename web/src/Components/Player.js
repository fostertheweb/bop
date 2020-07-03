import React, { useEffect, useState, useRef } from "react";
import PlayerControls from "containers/PlayerControls";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusicSlash, faVolume } from "@fortawesome/pro-solid-svg-icons";
import Devices from "components/Devices";
import { useQueue } from "hooks/use-queue";
import { currentPlaybackAtom, isPlayingAtom } from "atoms/player";
import { useRecoilValue, useRecoilState } from "recoil";

export default function Player() {
	const { queue } = useQueue();
	const isPlaying = useRecoilValue(isPlayingAtom);
	const [progress, setProgress] = useState(0);
	const [currentPlayback, setCurrentPlayback] = useRecoilState(
		currentPlaybackAtom,
	);
	const timer = useRef(null);

	useEffect(() => {
		setCurrentPlayback(queue[0]);
	}, [queue, setCurrentPlayback]);

	useEffect(() => {
		if (currentPlayback) {
			setProgress(parseInt(currentPlayback.progress_ms));
		}
	}, [currentPlayback, setProgress]);

	useEffect(() => {
		if (currentPlayback?.id && isPlaying) {
			clearInterval(timer.current);
			const incrementProgress = () => {
				setProgress(progress + 1500);
			};
			timer.current = setInterval(() => incrementProgress(), 1500);

			return () => clearInterval(timer.current);
		}

		if (isPlaying === false) {
			clearInterval(timer.current);
		}

		// eslint-disable-next-line
	}, [currentPlayback, isPlaying, progress]);

	useEffect(() => {
		if (currentPlayback) {
			if (((progress * 100) / currentPlayback.duration_ms).toFixed(2) >= 100) {
				clearInterval(timer.current);
			}
		}
		// eslint-disable-next-line
	}, [progress, currentPlayback]);

	return (
		<div className="w-full">
			<motion.div
				className="cq-bg-dark absolute bottom-0 z-49 max-w-full"
				animate={{
					width: `${((progress * 100) / currentPlayback?.duration_ms).toFixed(
						2,
					)}%`,
				}}
				transition={{ ease: "linear", duration: 1.6 }}
				style={{
					height: 80,
				}}></motion.div>
			<div
				className="box-border bg-transparent sticky top-0 w-full flex items-center justify-between border-t border-gray-700 shadow z-50"
				style={{ height: "80px" }}>
				<div className="w-1/3">
					{currentPlayback ? (
						<>
							<div
								key={currentPlayback.id}
								className="text-left flex items-center w-full">
								<div className="pl-4">
									<img
										src={currentPlayback?.album?.images[1].url}
										width="48"
										height="48"
										alt="album art"
										className="shadow"
									/>
								</div>
								<div className="pl-4">
									<div className="text-gray-400">{currentPlayback.name}</div>
									<div className="text-gray-500">
										{currentPlayback.artists
											?.map((artist) => artist.name)
											.join(", ")}
									</div>
								</div>
							</div>
						</>
					) : (
						<div
							className="pl-4 text-gray-600 flex items-center"
							style={{ height: "80px" }}>
							<FontAwesomeIcon
								icon={faMusicSlash}
								size="lg"
								className="fill-current mr-2"
							/>
							Add songs to the Play Queue
						</div>
					)}
				</div>
				<div className="w-1/3">
					<PlayerControls />
				</div>
				<div className="w-1/3 flex items-center justify-end">
					<div className="flex items-center mr-6">
						<FontAwesomeIcon icon={faVolume} size="lg" color="white" />
						<input type="range" className="ml-2" />
					</div>
					<Devices />
				</div>
			</div>
		</div>
	);
}
