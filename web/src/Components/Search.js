import React, { useState } from "react";
import useSpotify from "../hooks/useSpotify";

export default function({ dispatch }) {
  const { searchSpotify } = useSpotify();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async query => {
    const { tracks } = await searchSpotify(query);
    setResults(tracks);
  };

  const addToQueue = item => dispatch({ type: "addToQueue", item });

  return (
    <div>
      <input
        id="search"
        placeholder="Search by track or artist"
        onChange={({ target }) => handleSearch(target.value)}
      />
      <div>
        {results?.items?.map(item => (
          <button onClick={() => addToQueue(item)} key={item.id}>
            {item.name} by {item.artists.map(artist => artist.name).join(", ")}
          </button>
        ))}
      </div>
    </div>
  );
}
