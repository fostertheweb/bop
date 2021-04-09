import { faHeart, faThumbsDown } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Reactions() {
  return (
    <div className="flex justify-center text-white">
      <button>
        <FontAwesomeIcon icon={faHeart} size="lg" />
      </button>
      <div className="w-8"></div>
      <button>
        <FontAwesomeIcon icon={faThumbsDown} size="lg" />
      </button>
    </div>
  );
}
