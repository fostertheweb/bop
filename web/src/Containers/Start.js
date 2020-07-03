import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { playQueueAtom } from "atoms/play-queue";

export default function Start() {
	const playQueue = useRecoilValue(playQueueAtom);

	return (
		<div className="flex flex-col justify-center h-screen w-full items-center">
			<h1 className="text-xl tracking-wide cq-text-white font-medium">
				CrowdQ
			</h1>
			<div className="mt-8 flex flex-col items-center">
				{playQueue.length > 0 ? <ResumeOrNew /> : null}
				<NewSession />
			</div>
		</div>
	);
}

function ResumeOrNew() {
	return (
		<Link
			to="host"
			className="text-base leading px-6 py-3 rounded-full bg-green-500 text-white hover:bg-green-600">
			Resume Current Queue
		</Link>
	);
}

function NewSession() {
	return (
		<>
			<Link
				to="login"
				className="text-base leading px-6 py-3 rounded-full bg-purple-500 text-white hover:bg-purple-600">
				Host a Party
			</Link>
			<Link
				to="join"
				className="text-base leading px-6 py-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600">
				Join a Party
			</Link>
		</>
	);
}
