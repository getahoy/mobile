import { useEffect } from "react";
import { AppState } from "react-native";
import type { PairedMac } from "../storage/pairedMacs";
import { useMacConnections } from "./useMacConnections";

export function useKeepMacsConnected(
  macs: readonly PairedMac[] | null,
  onEnded: () => void,
): void {
  const connections = useMacConnections();

  useEffect(() => {
    if (macs) connections.sync(macs, onEnded);
  }, [connections, macs, onEnded]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState === "active") connections.foreground();
      if (appState === "background") connections.background();
    });
    return () => {
      subscription.remove();
      connections.stopAll();
    };
  }, [connections]);
}
