import type { EndReason } from "@getahoy/protocol";
import { endPairing, settleEndedMacs } from "../endedPairing";
import { saveEndedNotice } from "../storage/endedNotice";
import {
  readPairedMacs,
  readStoredMacs,
  writePairedMacs,
} from "../storage/pairedMacs";

// An end learned this soon after launch happened while Ahoy was closed: the
// first link sync and the first handshake both run in this window.
const LAUNCH_WINDOW_MS = 15_000;
const launchedAt = Date.now();

export async function endPairedMac(
  publicKey: string,
  reason: EndReason,
): Promise<void> {
  const at = Date.now();
  const whileClosed = at - launchedAt < LAUNCH_WINDOW_MS;
  const ending = { reason, at, whileClosed };
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
