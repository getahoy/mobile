import type { EndReason } from "@getahoy/protocol";
import { endPairing, settleEndedMacs } from "../endedPairing";
import { saveEndedNotice } from "../storage/endedNotice";
import {
  readPairedMacs,
  readStoredMacs,
  writePairedMacs,
} from "../storage/pairedMacs";

export async function endPairedMac(
  publicKey: string,
  reason: EndReason,
): Promise<void> {
  const ending = { reason, at: Date.now() };
  const ended = endPairing(await readPairedMacs(), publicKey, ending);
  if (!ended) return;
  await writePairedMacs(ended.macs);
  saveEndedNotice(ended.notice);
}

export async function settleStoredEndedMacs(): Promise<void> {
  const settled = settleEndedMacs(await readStoredMacs());
  if (!settled) return;
  await writePairedMacs(settled.macs);
  saveEndedNotice(settled.notice);
}
