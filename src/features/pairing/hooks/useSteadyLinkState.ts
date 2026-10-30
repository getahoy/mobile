import { useEffect, useState } from "react";
import type { MacLinkState } from "../connection/macLinkState";
import { isLinkBlip, LINK_BLIP_MS } from "../steadyLinkState";

export function useSteadyLinkState(state: MacLinkState): MacLinkState {
  const [shown, setShown] = useState(state);

  useEffect(() => {
    if (!isLinkBlip(shown, state)) {
      setShown(state);
      return;
    }
    const timer = setTimeout(() => setShown(state), LINK_BLIP_MS);
    return () => clearTimeout(timer);
  }, [shown, state]);

  return isLinkBlip(shown, state) ? shown : state;
}
