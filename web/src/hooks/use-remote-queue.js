// import { useRecoilValue } from "recoil";
// import { useParams } from "react-router-dom";
// import { displayNameState } from "atoms/display-name";

// const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export function useRemoteQueue() {
  // const displayName = useRecoilValue(displayNameState);
  // const { room } = useParams();

  function addToQueue(item) {
    console.log({ emit: "addToQueue", arg: item });
  }

  return { addToQueue };
}
