import { pairingUnlinkRequestSchema } from "@getahoy/protocol";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";

const PENDING_UNLINKS_ENTRY = "ahoy.pending.unlinks";

const pendingListSchema = z.array(pairingUnlinkRequestSchema);

export type PendingUnlink = z.infer<typeof pairingUnlinkRequestSchema>;

export async function readPendingUnlinks(): Promise<PendingUnlink[]> {
  const text = await SecureStore.getItemAsync(PENDING_UNLINKS_ENTRY);
  if (text === null) return [];
  try {
    const parsed = pendingListSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

async function writePendingUnlinks(list: PendingUnlink[]): Promise<void> {
  await SecureStore.setItemAsync(PENDING_UNLINKS_ENTRY, JSON.stringify(list));
}

export async function queuePendingUnlink(unlink: PendingUnlink): Promise<void> {
  const pending = await readPendingUnlinks();
  const others = pending.filter(
    (p) => p.peerPublicKey !== unlink.peerPublicKey,
  );
  await writePendingUnlinks([...others, unlink]);
}

export async function settlePendingUnlink(
  peerPublicKey: string,
): Promise<void> {
  const pending = await readPendingUnlinks();
  const left = pending.filter((p) => p.peerPublicKey !== peerPublicKey);
  await writePendingUnlinks(left);
}

export async function clearPendingUnlinks(): Promise<void> {
  await SecureStore.deleteItemAsync(PENDING_UNLINKS_ENTRY);
}
