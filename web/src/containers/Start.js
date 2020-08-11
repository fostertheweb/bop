import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { playQueueAtom } from "hooks/use-queue";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSheep,
  faUsersCrown,
  faListMusic,
} from "@fortawesome/pro-duotone-svg-icons";

export default function Start() {
  const playQueue = useRecoilValue(playQueueAtom);

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faListMusic}
          size="lg"
          className="theme-logo mr-2"
        />
        <h1 className="cq-text-white text-2xl font-medium tracking-wider cabin">
          CrowdQ.fm
        </h1>
      </div>
      <div>
        {playQueue.length > 0 ? <ResumeSession /> : null}

        <div className="flex items-center">
          <JoinSession />
          <HostNewSession />
        </div>
      </div>
    </div>
  );
}

function ResumeSession() {
  return (
    <div className="flex flex-col p-8">
      <div></div>
      <Link to="host" className="">
        Resume Session
      </Link>
    </div>
  );
}

function JoinSession() {
  return (
    <div className="flex flex-col p-8 items-center">
      <div className="mt-4 p-8 text-center">
        <FontAwesomeIcon icon={faSheep} size="4x" className="theme-sheep" />
      </div>
      <Link
        to="join"
        className={classNames(
          baseButton,
          hover,
          "cq-bg-blue",
          "text-white",
          "mt-4",
        )}>
        Join Session
      </Link>
    </div>
  );
}

function HostNewSession() {
  return (
    <div className="flex flex-col p-8 items-center">
      <div className="mt-4 p-8 text-center">
        <FontAwesomeIcon icon={faUsersCrown} size="4x" className="theme-host" />
      </div>
      <Link
        to="login"
        className={classNames(
          baseButton,
          hover,
          "cq-bg-green",
          "text-white",
          "mt-4",
        )}>
        Host New Session
      </Link>
    </div>
  );
}

const baseButton = [
  "px-6",
  "py-4",
  "cursor-pointer",
  "shadow",
  "text-base",
  "tracking-wide",
  "font-medium",
  "rounded",
  "text-shadow",
];

const hover = ["bg-opacity-75"];
