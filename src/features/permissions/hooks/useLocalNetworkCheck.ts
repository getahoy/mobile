import { getNetworkStateAsync, NetworkStateType } from "expo-network";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import type { MacLinkState } from "@/features/pairing/connection/macLinkState";
import { permissionPlatform } from "../platform/permissionPlatform";
import { hasReachedOnLan } from "../storage/localNetworkMemory";

function onWifi(): Promise<boolean> {
  return getNetworkStateAsync().then(
    (network) => network.type === NetworkStateType.WIFI,
    () => false,
  );
}

// iOS cannot report the Local Network setting, so the guide opens on its own
// only for a Mac this phone has never reached over Wi‑Fi, and otherwise waits
// behind the Can't reach card's link.
export function useLocalNetworkCheck(publicKey: string, state: MacLinkState) {
  const opened = useRef(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const cantReach =
    permissionPlatform.asksForLocalNetwork &&
    state.kind === "unreachable" &&
    !state.onCellular;
  const suspect =
    cantReach && appState === "active" && !hasReachedOnLan(publicKey);
  const openGuide = useCallback(
    () =>
      router.push({ pathname: "/local-network", params: { mac: publicKey } }),
    [publicKey],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", setAppState);
    return () => subscription.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!suspect || opened.current) return;
      let focused = true;
      void onWifi().then((wifi) => {
        if (!wifi || !focused || opened.current) return;
        opened.current = true;
        openGuide();
      });
      return () => {
        focused = false;
      };
    }, [suspect, openGuide]),
  );

  return cantReach ? openGuide : null;
}
