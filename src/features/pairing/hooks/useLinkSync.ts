import { useEffect } from "react";
import { AppState } from "react-native";
import { flushPendingUnlinks, markEndedMacs } from "../sync/linkSync";

async function syncLinks(onSynced: () => void): Promise<void> {
  await flushPendingUnlinks().catch(() => undefined);
  await markEndedMacs().catch(() => undefined);
  onSynced();
}

export function useLinkSync(onSynced: () => void): void {
  useEffect(() => {
    void syncLinks(onSynced);
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState === "active") void syncLinks(onSynced);
    });
    return () => subscription.remove();
  }, [onSynced]);
}
