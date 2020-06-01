import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useQueue } from "../hooks/use-queue";
import { useSearch } from "../hooks/use-search";

export default function Search() {
	const { addToQueue } = useQueue();
	const { search } = useSearch();
	const [results, setResults] = useState([]);

	const handleSearch = async (query) => {
		const { tracks } = await search(query);
		setResults(tracks);
	};

	return (
		<div className="p-2">
			<div className="sticky top-0 bg-gray-800">
				<div className="p-2 bg-gray-800 flex items-center">
					<div className="flex items-center border-2 border-gray-700 text-base rounded focus-within:border-green-500 w-full bg-gray-900 text-gray-200">
						<FontAwesomeIcon
							icon={faSpotify}
							size="lg"
							className="text-gray-500 fill-current ml-2"
						/>
						<input
							className="appearance-none text-base rounded px-4 py-2 pl-2 focus:outline-none w-full bg-gray-900 text-gray-200"
							id="search"
							placeholder="Search by track or artist"
							onChange={({ target }) => handleSearch(target.value)}
						/>
					</div>
				</div>
			</div>
			<div>
				{results?.items?.map((item) => (
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
