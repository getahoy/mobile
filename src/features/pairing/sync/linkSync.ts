import { encodeBytes } from "@getahoy/crypto";
import type { RequestResult } from "@getahoy/lib";
import type { GoodbyeReason } from "@getahoy/protocol";
import { listPairingLinks, unlinkPairing } from "../client/pairingApi";
import type { LiveMacLinks } from "../connection/liveMacLinks";
import { clearDeviceKeys, loadDeviceKeys } from "../storage/deviceKeys";
import {
  clearPairedMacs,
  readPairedMacs,
  updatePairedMac,
} from "../storage/pairedMacs";
import {
  clearPendingUnlinks,
  queuePendingUnlink,
  readPendingUnlinks,
  settlePendingUnlink,
} from "../storage/pendingUnlinks";

type UnlinkReason = Extract<GoodbyeReason, "removed" | "signed_out">;

function settled(result: RequestResult<unknown>): boolean {
  if (result.code === "success") return true;
  const { error } = result;
  return error.kind === "api" && error.detail.code === "not_found";
}

export async function flushPendingUnlinks(): Promise<void> {
  for (const unlink of await readPendingUnlinks()) {
    if (settled(await unlinkPairing(unlink))) {
      await settlePendingUnlink(unlink.peerPublicKey);
    }
  }
}

export async function queueUnlink(macKey: string, reason: UnlinkReason) {
  const keys = await loadDeviceKeys();
  const devicePublicKey = encodeBytes(keys.publicKey);
  await queuePendingUnlink({ devicePublicKey, peerPublicKey: macKey, reason });
}

export async function markEndedMacs(): Promise<void> {
  const live = (await readPairedMacs()).filter((mac) => !mac.ended);
  if (live.length === 0) return;
  const keys = await loadDeviceKeys();
  const listed = await listPairingLinks(encodeBytes(keys.publicKey));
  if (listed.code === "error") return;
  for (const mac of live) {
    const link = listed.data.links.find(
      (l) => l.peerPublicKey === mac.publicKey,
    );
    if (!link || link.active) continue;
    const ended = { reason: link.reason ?? "removed", at: Date.now() };
    await updatePairedMac(mac.publicKey, { ended });
  }
}

export async function unpairEverything(live: LiveMacLinks): Promise<void> {
  live.goodbyeAll("signed_out");
  const macs = (await readPairedMacs()).filter((mac) => !mac.ended);
  for (const mac of macs) await queueUnlink(mac.publicKey, "signed_out");
  await flushPendingUnlinks();
  await Promise.all([clearPairedMacs(), clearPendingUnlinks()]);
  await clearDeviceKeys();
}
