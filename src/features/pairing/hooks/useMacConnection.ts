import { getNetworkStateAsync, NetworkStateType } from "expo-network";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { connectToMac, type MacLink } from "../connection/connectToMac";
import type { FrameStream } from "../connection/frameStream";
import { loadDeviceKeys } from "../storage/deviceKeys";
import type { PairedMac } from "../storage/pairedMacs";

const AUTO_RETRY_MS = 5000;

export type MacLinkState =
  | { kind: "connecting" }
  | { kind: "connected" }
  | { kind: "unreachable"; onCellular: boolean }
  | { kind: "macTooOld" }
  | { kind: "macTooNew" }
  | { kind: "rejected" };

async function unreachableState(): Promise<MacLinkState> {
  const network = await getNetworkStateAsync().catch(() => null);
  const onCellular = network?.type === NetworkStateType.CELLULAR;
  return { kind: "unreachable", onCellular };
}

export function useMacConnection(mac: PairedMac) {
  const [state, setState] = useState<MacLinkState>({ kind: "connecting" });
  const stream = useRef<FrameStream | null>(null);
  const attempt = useRef(0);

  const disconnect = useCallback(() => {
    attempt.current += 1;
    stream.current?.close();
    stream.current = null;
  }, []);

  const establish = useCallback(async () => {
    disconnect();
    const current = attempt.current;
    const isCurrent = () => current === attempt.current;
    const link = await loadDeviceKeys()
      .then((keys) => connectToMac(mac, keys))
      .catch((): MacLink => ({ outcome: "unreachable" }));
    if (!isCurrent()) {
      if (link.outcome === "connected") link.stream.close();
      return;
    }
    if (link.outcome === "connected") {
      stream.current = link.stream;
      link.stream.onClose(() => {
        if (isCurrent()) void unreachableState().then(setState);
      });
      setState({ kind: "connected" });
      return;
    }
    if (link.outcome === "unreachable") setState(await unreachableState());
    else setState({ kind: link.outcome });
  }, [mac, disconnect]);

  const connect = useCallback(() => {
    setState({ kind: "connecting" });
    void establish();
  }, [establish]);

  useEffect(() => {
    connect();
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState === "background") disconnect();
      if (appState === "active" && !stream.current) connect();
    });
    return () => {
      subscription.remove();
      disconnect();
    };
  }, [connect, disconnect]);

  useRetryWhileUnreachable(state, establish);

  return { state, retry: connect };
}

function useRetryWhileUnreachable(
  state: MacLinkState,
  establish: () => Promise<void>,
) {
  useEffect(() => {
    if (state.kind !== "unreachable") return;
    const timer = setTimeout(() => {
      if (AppState.currentState === "active") void establish();
    }, AUTO_RETRY_MS);
    return () => clearTimeout(timer);
  }, [state, establish]);
}
