import { faHeart, faThumbsDown } from "@fortawesome/pro-light-svg-icons";
import {
  faHeart as faHeartSolid,
  faThumbsDown as faThumbsDownSolid,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useCheckIfSavedTrack,
  useRemoveTrack,
  useSaveTrack,
} from "hooks/spotify/use-liked-songs";
import React, { useState } from "react";

export default function Reactions({ disabled, trackId }) {
  const [skipped, setSkipped] = useState(false);
  const { data: liked, status: checkStatus } = useCheckIfSavedTrack(trackId);
  const [saveTrack, { status: saveStatus }] = useSaveTrack(trackId);
  const [removeTrack, { status: removeStatus }] = useRemoveTrack(trackId);
  const loading =
    saveStatus === "loading" ||
    checkStatus === "loading" ||
    removeStatus === "loading";

  function handleHeartClick() {
    if (liked === true) {
      removeTrack();
    } else {
      saveTrack();
    }
  }

  return (
    <div className="flex justify-center text-gray-300">
      <button
        disabled={disabled || loading}
        className={disabled ? "text-gray-500" : "hover:text-white"}
        onClick={handleHeartClick}>
        <FontAwesomeIcon
          className="drop-shadow"
          icon={liked ? faHeartSolid : faHeart}
          size="lg"
        />
      </button>
      <div className="w-8"></div>
      <button
        disabled={true}
        className={true ? "text-gray-500" : "hover:text-white"}
        onClick={() => setSkipped(!skipped)}>
        <FontAwesomeIcon
          className="filter drop-shadow"
          icon={skipped ? faThumbsDownSolid : faThumbsDown}
          size="lg"
        />
      </button>
    </div>
  );
}
