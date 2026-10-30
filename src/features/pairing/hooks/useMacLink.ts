import { useSyncExternalStore } from "react";
import type { MacLinkState } from "../connection/macLinkState";
import type { PairedMac } from "../storage/pairedMacs";
import { useLiveMacLinks } from "./useLiveMacLinks";
import { useMacConnections } from "./useMacConnections";

const CONNECTING: MacLinkState = { kind: "connecting" };

export function useMacLink(mac: PairedMac) {
  const live = useLiveMacLinks();
  const connections = useMacConnections();
  const reported = useSyncExternalStore(live.onChange, () =>
    live.state(mac.publicKey),
  );
  const connection = connections.connection(mac.publicKey);
  const state: MacLinkState = mac.ended
    ? { kind: "ended", reason: mac.ended.reason }
    : (reported ?? connection?.state() ?? CONNECTING);
  return { state, connection };
}
