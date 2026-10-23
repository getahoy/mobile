import { bytes32Schema } from "@getahoy/protocol";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";

const PAIRED_MACS_ENTRY = "ahoy.paired.macs";

const pairedMacSchema = z.object({
  publicKey: bytes32Schema,
  displayName: z.string(),
  lastKnownAddresses: z.array(z.string()),
  lanPort: z.int().nullable(),
  pairedAt: z.int(),
});

export type PairedMac = z.infer<typeof pairedMacSchema>;

const pairedMacListSchema = z.array(pairedMacSchema);

export async function readPairedMacs(): Promise<PairedMac[]> {
  const text = await SecureStore.getItemAsync(PAIRED_MACS_ENTRY);
  if (text === null) return [];
  try {
    const parsed = pairedMacListSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export async function savePairedMac(mac: PairedMac): Promise<void> {
  const others = (await readPairedMacs()).filter(
    (stored) => stored.publicKey !== mac.publicKey,
  );
  const list = [mac, ...others];
  await SecureStore.setItemAsync(PAIRED_MACS_ENTRY, JSON.stringify(list));
}
