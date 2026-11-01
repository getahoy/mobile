import { bytes32Schema, endReasonSchema } from "@getahoy/protocol";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";

const PAIRED_MACS_ENTRY = "ahoy.paired.macs";

const pairedMacSchema = z.object({
  publicKey: bytes32Schema,
  displayName: z.string(),
  lastKnownAddresses: z.array(z.string()),
  lanPort: z.int().nullable(),
  pairedAt: z.int(),
  paused: z.boolean().default(false),
});

// Older builds kept an ended Mac in the list; settleEndedMacs migrates it.
const storedMacSchema = pairedMacSchema.extend({
  ended: z
    .object({ reason: endReasonSchema, at: z.int() })
    .nullable()
    .default(null),
});

export type PairedMac = z.infer<typeof pairedMacSchema>;
type StoredMac = z.infer<typeof storedMacSchema>;

const storedMacListSchema = z.array(storedMacSchema);

export async function readStoredMacs(): Promise<StoredMac[]> {
  const text = await SecureStore.getItemAsync(PAIRED_MACS_ENTRY);
  if (text === null) return [];
  try {
    const parsed = storedMacListSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export async function readPairedMacs(): Promise<PairedMac[]> {
  return (await readStoredMacs()).filter((mac) => !mac.ended);
}

export async function writePairedMacs(list: PairedMac[]): Promise<void> {
  await SecureStore.setItemAsync(PAIRED_MACS_ENTRY, JSON.stringify(list));
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
  change: Partial<Pick<PairedMac, "paused">>,
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
  await SecureStore.deleteItemAsync(PAIRED_MACS_ENTRY);
}
