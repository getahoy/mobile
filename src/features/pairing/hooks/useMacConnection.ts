import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { MacConnection } from "../connection/macConnection";
import type { PairedMac } from "../storage/pairedMacs";
import { useLiveMacLinks } from "./useLiveMacLinks";

export function useMacConnection(mac: PairedMac, onEnded: () => void) {
  const live = useLiveMacLinks();
  const [connection] = useState(
    () => new MacConnection({ mac, live, onEnded }),
  );
  const [state, setState] = useState(connection.state());

  useEffect(() => {
    const unsubscribe = connection.onState(setState);
    connection.start();
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState === "active") connection.foreground();
      if (appState === "background") connection.background();
    });
    return () => {
      unsubscribe();
      subscription.remove();
      connection.stop();
    };
  }, [connection]);

  return { state, connection };
}
