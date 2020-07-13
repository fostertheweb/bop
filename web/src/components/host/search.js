import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useQueue } from "hooks/use-queue";
import { useSearch } from "hooks/use-search";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useDebounce } from "hooks/use-debounce";

export default function Search() {
	const { addToQueue } = useQueue();
	const search = useSearch();
	const [searching, setSearching] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const debounced = useDebounce(query, 500);

	useEffect(() => {
		if (debounced) {
			setSearching(true);
			search(debounced).then(({ items = [] }) => {
				setResults(items);
				setSearching(false);
			});
		} else {
			setResults([]);
		}

		// eslint-disable-next-line
	}, [debounced]);

	return (
		<div className="p-2">
			<div className="sticky top-0">
				<div className="p-2 flex items-center">
					<div className="cq-bg-darker flex items-center border-2 border-gray-700 text-base rounded focus-within:border-green-500 focus-within:bg-gray-800 w-full text-gray-200">
						<FontAwesomeIcon
							icon={searching ? faSpinnerThird : faSpotify}
							size="lg"
							className="text-gray-500 fill-current ml-2"
							spin={searching}
						/>
						<input
							className="appearance-none bg-transparent text-base rounded px-4 py-2 pl-2 focus:outline-none w-full text-gray-200"
							id="search"
							placeholder="Search by track or artist"
							onChange={({ target }) => setQuery(target.value)}
							autoComplete="false"
						/>
					</div>
				</div>
			</div>
			<div>
				{results?.map((item) => (
					<button
						onClick={() => addToQueue(item)}
						key={item.id}
						className="text-left p-2 flex items-center w-full border-b border-gray-900">
						<div className="p-2">
							<img
								src={item.album.images[2].url}
								alt="album art"
								className="shadow h-10 w-10"
							/>
						</div>
						<div className="ml-1">
							<div className="text-gray-400">{item.name}</div>
							<div className="text-gray-500">
								{item.artists.map((artist) => artist.name).join(", ")}
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
