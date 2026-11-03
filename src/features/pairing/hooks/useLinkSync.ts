import { useEffect } from "react";
import { AppState } from "react-native";
import { syncLinks } from "../sync/linkSync";

export function useLinkSync(onSynced: () => void): void {
  useEffect(() => {
    void syncLinks().then(onSynced);
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState === "active") void syncLinks().then(onSynced);
    });
    return () => subscription.remove();
  }, [onSynced]);
}
