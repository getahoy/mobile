import { useCallback, useState } from "react";
import { Wordmark } from "@/features/welcome/components/wordmark";
import { launchVeilTheme } from "../applyStoredAppearance";
import { ThemeVeil } from "./themeVeil";

type LaunchVeilProps = { splashHidden: boolean };

// iOS draws the splash before any code runs, so it can only follow the system; when the
// choice differs, the first frame repeats the splash and fades to the chosen theme.
export function LaunchVeil({ splashHidden }: LaunchVeilProps) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => setDone(true), []);
  if (done || launchVeilTheme === null) return null;
  return (
    <ThemeVeil theme={launchVeilTheme} fading={splashHidden} onDone={finish}>
      <Wordmark theme={launchVeilTheme} />
    </ThemeVeil>
  );
}
