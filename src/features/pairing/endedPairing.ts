import { endedWhen as endedWhenText } from "@getahoy/lib";
import type { EndReason } from "@getahoy/protocol";
import { macCopy } from "./copy/macCopy.ts";

type Ending = { reason: EndReason; at: number; whileClosed: boolean };

export type EndedNotice = Ending & { deviceName: string };

type NamedMac = { publicKey: string; displayName: string };

type Ended<T> = { macs: T[]; notice: EndedNotice };

type StoredEnd = { reason: EndReason; at: number } | null;

export function endPairing<T extends NamedMac>(
  macs: readonly T[],
  publicKey: string,
  ending: Ending,
): Ended<T> | null {
  const mac = macs.find((candidate) => candidate.publicKey === publicKey);
  if (!mac) return null;
  return {
    macs: macs.filter((candidate) => candidate !== mac),
    notice: { deviceName: mac.displayName, ...ending },
  };
}

export function settleEndedMacs<T extends NamedMac & { ended: StoredEnd }>(
  stored: readonly T[],
): Ended<T> | null {
  let notice: EndedNotice | null = null;
  for (const mac of stored) {
    if (!mac.ended || (notice && notice.at >= mac.ended.at)) continue;
    notice = { deviceName: mac.displayName, whileClosed: false, ...mac.ended };
  }
  return notice ? { macs: stored.filter((mac) => !mac.ended), notice } : null;
}

export function endedWhen(notice: EndedNotice, now: number): string {
  const awayNote = notice.whileClosed ? macCopy.whileClosedNote : null;
  return endedWhenText(notice.at, now, awayNote);
}
