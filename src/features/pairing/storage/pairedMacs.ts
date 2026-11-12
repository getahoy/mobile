import { parseStored } from "@getahoy/lib";
import { z } from "zod";
import {
  type PairedMac,
  type StoredMac,
  storedMacSchema,
} from "./pairedMacSchema";
import { pairingEntry, pairingKeychain } from "./pairingKeychain";

export type { PairedMac };

type AddressChange = "lastKnownAddresses" | "localHost" | "lanPort";
type MacChange = Partial<Pick<PairedMac, "paused" | AddressChange>>;

const storedMacListSchema = z.array(storedMacSchema);

// A restored Android backup cannot be decrypted and the read throws; that reads as no Macs.
export async function readStoredMacs(): Promise<StoredMac[]> {
  const text = await pairingKeychain
    .read(pairingEntry.pairedMacs)
    .catch(() => null);
  return parseStored(storedMacListSchema, text) ?? [];
}

export async function readPairedMacs(): Promise<PairedMac[]> {
  return (await readStoredMacs()).filter((mac) => !mac.ended);
}

export async function writePairedMacs(list: PairedMac[]): Promise<void> {
  await pairingKeychain.write(pairingEntry.pairedMacs, JSON.stringify(list));
}

async function macsWithout(publicKey: string): Promise<PairedMac[]> {
  const stored = await readPairedMacs();
  return stored.filter((mac) => mac.publicKey !== publicKey);
}

export async function savePairedMac(mac: PairedMac): Promise<void> {
  await writePairedMacs([mac, ...(await macsWithout(mac.publicKey))]);
}

export async function updatePairedMac(
  publicKey: string,
  change: MacChange,
): Promise<void> {
  const stored = await readPairedMacs();
  const updated = stored.map((mac) =>
    mac.publicKey === publicKey ? { ...mac, ...change } : mac,
  );
  await writePairedMacs(updated);
}

export async function removePairedMac(publicKey: string): Promise<void> {
  await writePairedMacs(await macsWithout(publicKey));
}

export async function clearPairedMacs(): Promise<void> {
  await pairingKeychain.remove(pairingEntry.pairedMacs);
}
