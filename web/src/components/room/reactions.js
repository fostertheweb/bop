import { faHeart, faThumbsDown } from "@fortawesome/pro-light-svg-icons";
import {
  faHeart as faHeartSolid,
  faThumbsDown as faThumbsDownSolid,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function Reactions({ disabled }) {
  const [liked, setLiked] = useState(false);
  const [skipped, setSkipped] = useState(false);

  return (
    <div className="flex justify-center text-gray-300">
      <button className="hover:text-white" onClick={() => setLiked(!liked)}>
        <FontAwesomeIcon icon={liked ? faHeartSolid : faHeart} size="lg" />
      </button>
      <div className="w-8"></div>
      <button className="hover:text-white" onClick={() => setSkipped(!skipped)}>
        <FontAwesomeIcon
          icon={skipped ? faThumbsDownSolid : faThumbsDown}
          size="lg"
        />
      </button>
    </div>
  );
}
