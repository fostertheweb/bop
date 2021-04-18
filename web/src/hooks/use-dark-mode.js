import { useEffect } from "react";

const key = "crowdQ.theme";

export function useDarkMode() {
  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      localStorage[key] === "dark" ||
      (!(key in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
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
