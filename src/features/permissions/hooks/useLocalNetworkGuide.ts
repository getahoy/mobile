import { useEffect, useSyncExternalStore } from "react";
import { useLiveMacLinks } from "@/features/pairing/hooks/useLiveMacLinks";
import { backHomeTurnedOn } from "../turnedOn";

export function useLocalNetworkGuide(publicKey: string): void {
  const live = useLiveMacLinks();
  const state = useSyncExternalStore(live.onChange, () =>
    live.state(publicKey),
  );
  const connected = state?.kind === "connected";

  useEffect(() => {
    if (connected) backHomeTurnedOn("net");
  }, [connected]);
}
