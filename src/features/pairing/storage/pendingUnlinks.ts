import { parseStored } from "@getahoy/lib";
import { pairingUnlinkRequestSchema } from "@getahoy/protocol";
import { z } from "zod";
import { pairingEntry, pairingKeychain } from "./pairingKeychain";

const pendingListSchema = z.array(pairingUnlinkRequestSchema);

export type PendingUnlink = z.infer<typeof pairingUnlinkRequestSchema>;

export async function readPendingUnlinks(): Promise<PendingUnlink[]> {
  const text = await pairingKeychain
    .read(pairingEntry.pendingUnlinks)
    .catch(() => null);
  return parseStored(pendingListSchema, text) ?? [];
}

async function writePendingUnlinks(list: PendingUnlink[]): Promise<void> {
  await pairingKeychain.write(
    pairingEntry.pendingUnlinks,
    JSON.stringify(list),
  );
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
  await pairingKeychain.remove(pairingEntry.pendingUnlinks);
}
