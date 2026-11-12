import { MAX_LAN_HOSTS } from "@getahoy/protocol";
import { markReachedOnLan } from "@/features/permissions/storage/localNetworkMemory";
import { type PairedMac, updatePairedMac } from "../storage/pairedMacs";
import type { ConnectedLink } from "./connectToMac";

function sameList(left: readonly string[], right: readonly string[]): boolean {
  return (
    left.length === right.length &&
    left.every((entry, index) => entry === right[index])
  );
}

function refreshedMac(
  mac: PairedMac,
  { ip, lan }: ConnectedLink,
): PairedMac | null {
  const known = mac.lastKnownAddresses;
  const first = ip === null ? [] : [ip];
  const merged = new Set([...first, ...(lan?.hosts ?? []), ...known]);
  const lastKnownAddresses = [...merged].slice(0, MAX_LAN_HOSTS);
  const localHost = lan?.local ?? mac.localHost;
  const lanPort = lan?.port ?? mac.lanPort;
  const unchanged =
    sameList(lastKnownAddresses, known) &&
    localHost === mac.localHost &&
    lanPort === mac.lanPort;
  return unchanged ? null : { ...mac, lastKnownAddresses, localHost, lanPort };
}

export function rememberLink(mac: PairedMac, link: ConnectedLink): PairedMac {
  markReachedOnLan(mac.publicKey);
  const refreshed = refreshedMac(mac, link);
  if (!refreshed) return mac;
  const { lastKnownAddresses, localHost, lanPort } = refreshed;
  const addresses = { lastKnownAddresses, localHost, lanPort };
  void updatePairedMac(mac.publicKey, addresses);
  return refreshed;
}
