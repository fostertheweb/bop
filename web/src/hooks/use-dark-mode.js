import { useEffect } from "react";

const key = "crowdQ.theme";

export default function useDarkMode() {
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

  function setDarkTheme() {
    localStorage[key] = "dark";
  }

  function setLightTheme() {
    localStorage[key] = "light";
  }

  function setMatchOSTheme() {
    localStorage.removeItem(key);
  }

  function ThemeProvider() {
    return null;
  }

  return { setDarkTheme, setLightTheme, setMatchOSTheme, ThemeProvider };
}
