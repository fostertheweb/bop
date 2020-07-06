import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { displayNameState } from "atoms/display-name";
import { useDebounce } from "hooks/use-debounce";

export default function Join() {
	const [displayName, _setDisplayName] = useState("");
	const setDisplayName = useSetRecoilState(displayNameState);
	const debounced = useDebounce(displayName, 500);

	useEffect(() => {
		if (debounced) {
			setDisplayName(debounced);
		}
		// eslint-disable-next-line
	}, [debounced]);

	return (
		<div className="flex flex-col justify-center h-screen w-full items-center">
			<div className="cq-bg-darker flex items-center border-2 border-gray-700 text-base rounded focus-within:border-green-500 focus-within:bg-gray-800 w-full text-gray-200">
				<input
					className="appearance-none bg-transparent text-base rounded px-4 py-2 pl-2 focus:outline-none w-full text-gray-200"
					id="displayName"
					placeholder="Your display name"
					onChange={({ target }) => _setDisplayName(target.value)}
					autoComplete="false"
				/>
			</div>

			<h1>Active Sessions</h1>
			<div>
				<Link to="/listen/jfost784">jfost784</Link>
			</div>
		</div>
	);
}
