import React, { useEffect } from "react";
import Search from "components/listener/search";
import {
  atom,
  useRecoilValueLoadable,
  useSetRecoilState,
  useRecoilValue,
} from "recoil";
import { displayNameState } from "atoms/display-name";
import { Routes, Route, useParams } from "react-router-dom";
import ListenerLayout from "components/listener/layout";
import {
  clientAccessTokenQuery,
  clientAccessTokenState,
} from "hooks/use-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
// import { playQueueAtom } from "hooks/use-queue";

// const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export const currentRoomState = atom({
  key: "crowdQ.currentRoom",
  default: "",
});

export default function Listener() {
  const setCurrentRoom = useSetRecoilState(currentRoomState);
  const displayName = useRecoilValue(displayNameState);
  const { room } = useParams();
  const { state, contents } = useRecoilValueLoadable(clientAccessTokenQuery);
  const setClientAccessToken = useSetRecoilState(clientAccessTokenState);
  // const setQueue = useSetRecoilState(playQueueAtom);

  useEffect(() => {
    setCurrentRoom(room);
  }, [room]);

  useEffect(() => {
    if (state === "hasValue" && contents) {
      setClientAccessToken(contents.access_token);
    }
    //eslint-disable-next-line
  }, [state, contents]);

  if (state === "loading") {
    return <FontAwesomeIcon spin icon={faSpinnerThird} />;
  }

  return (
    <Routes>
      <Route path="/" element={<ListenerLayout />}>
        <Route path="/" element={<Search />} />
      </Route>
    </Routes>
  );
}
