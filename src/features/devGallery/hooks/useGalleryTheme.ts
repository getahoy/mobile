import { useEffect, useState } from "react";
import { Uniwind, useUniwind } from "uniwind";
import { readAppearance } from "@/features/appearance/storage/appearanceStorage";

export function useGalleryTheme() {
  const { theme } = useUniwind();
  const [dark, setDark] = useState(theme === "dark");

  useEffect(() => {
    Uniwind.setTheme(dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => () => Uniwind.setTheme(readAppearance()), []);

  return { dark, setDark };
}
