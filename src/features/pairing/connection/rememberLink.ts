import { markReachedOnLan } from "@/features/permissions/storage/localNetworkMemory";
import { type PairedMac, updatePairedMac } from "../storage/pairedMacs";
import type { ConnectedLink } from "./connectToMac";
import { refreshedMac } from "./macAddresses";

export function rememberLink(mac: PairedMac, link: ConnectedLink): PairedMac {
  markReachedOnLan(mac.publicKey);
  const refreshed = refreshedMac(mac, link.ip, link.lan);
  if (!refreshed) return mac;
  const { lastKnownAddresses, localHost, lanPort } = refreshed;
  const addresses = { lastKnownAddresses, localHost, lanPort };
  void updatePairedMac(mac.publicKey, addresses);
  return refreshed;
}
