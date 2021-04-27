import { useEffect } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const key = "crowdQ.theme";

const darkModeState = atom({
  key: "crowdQ.isDarkMode",
  default: false,
});

export function useIsDarkMode() {
  return useRecoilValue(darkModeState);
}

export function useSetIsDarkMode() {
  return useSetRecoilState(darkModeState);
}

export function useDarkMode() {
  const setIsDarkMode = useSetIsDarkMode();
  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      localStorage[key] === "dark" ||
      (!(key in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    //eslint-disable-next-line
  }, []);
}

export function setDarkTheme() {
  localStorage[key] = "dark";
}

export function setLightTheme() {
  localStorage[key] = "light";
}

export function setMatchOSTheme() {
  localStorage.removeItem(key);
}
