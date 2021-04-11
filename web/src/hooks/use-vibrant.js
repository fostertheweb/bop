import { useEffect, useState } from "react";
import * as Vibrant from "node-vibrant";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const initialColorState = {
  LightVibrant: "initial",
  DarkVibrant: "initial",
  DarkMuted: "initial",
};

const accentColorsState = atom({
  key: "crowdQ.accentColors",
  default: ["initial", "initial"],
});

export function useAccentColors() {
  return useRecoilValue(accentColorsState);
}

export function useSetAccentColors() {
  return useSetRecoilState(accentColorsState);
}

export function useVibrant(imageUrl) {
  const [colors, setColors] = useState(initialColorState);
  const setAccentColors = useSetAccentColors();

  useEffect(() => {
    if (imageUrl) {
      Vibrant.from(imageUrl)
        .getPalette()
        .then((palette) => {
          const colors = Object.keys(palette).reduce((theme, key) => {
            return { ...theme, [key]: palette[key].hex };
          }, {});
          setColors(colors);
          setAccentColors([colors.LightVibrant, colors.DarkVibrant]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    //eslint-disable-next-line
  }, [imageUrl]);

  return {
    colors,
    lightAccent: colors.LightVibrant,
    darkAccent: colors.DarkVibrant,
    background: `linear-gradient(0.3turn, ${[
      colors.DarkVibrant,
      colors.DarkMuted,
    ].join(",")})`,
  };
}
