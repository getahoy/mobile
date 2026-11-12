import { type LanEndpoint, MAX_LAN_HOSTS } from "@getahoy/protocol";
import type { PairedMac } from "../storage/pairedMacSchema.ts";

export function mergedAddresses(
  workingIp: string | null,
  current: readonly string[],
  known: readonly string[],
): string[] {
  const first = workingIp === null ? [] : [workingIp];
  const merged = new Set([...first, ...current, ...known]);
  return [...merged].slice(0, MAX_LAN_HOSTS);
}

function sameList(left: readonly string[], right: readonly string[]): boolean {
  return (
    left.length === right.length &&
    left.every((entry, index) => entry === right[index])
  );
}

export function refreshedMac(
  mac: PairedMac,
  workingIp: string | null,
  lan: LanEndpoint | null,
): PairedMac | null {
  const known = mac.lastKnownAddresses;
  const current = lan?.hosts ?? [];
  const lastKnownAddresses = mergedAddresses(workingIp, current, known);
  const localHost = lan?.local ?? mac.localHost;
  const lanPort = lan?.port ?? mac.lanPort;
  const unchanged =
    sameList(lastKnownAddresses, known) &&
    localHost === mac.localHost &&
    lanPort === mac.lanPort;
  return unchanged ? null : { ...mac, lastKnownAddresses, localHost, lanPort };
}
