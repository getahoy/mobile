import type { EndReason } from "@getahoy/protocol";

type Ending = { reason: EndReason; at: number };

export type EndedNotice = Ending & { macName: string };

type NamedMac = { publicKey: string; displayName: string };

type Ended<T> = { macs: T[]; notice: EndedNotice };

const HOURS_SHOWN = 24;
const MS_PER_HOUR = 3_600_000;
export const NOTICE_LIFETIME_MS = HOURS_SHOWN * MS_PER_HOUR;

export function endPairing<T extends NamedMac>(
  macs: readonly T[],
  publicKey: string,
  ending: Ending,
): Ended<T> | null {
  const mac = macs.find((candidate) => candidate.publicKey === publicKey);
  if (!mac) return null;
  return {
    macs: macs.filter((candidate) => candidate !== mac),
    notice: { macName: mac.displayName, ...ending },
  };
}

export function settleEndedMacs<T extends NamedMac & { ended: Ending | null }>(
  stored: readonly T[],
): Ended<T> | null {
  let notice: EndedNotice | null = null;
  for (const mac of stored) {
    if (!mac.ended || (notice && notice.at >= mac.ended.at)) continue;
    notice = { macName: mac.displayName, ...mac.ended };
  }
  return notice ? { macs: stored.filter((mac) => !mac.ended), notice } : null;
}

export function noticeShown(notice: EndedNotice, now: number): boolean {
  return now - notice.at < NOTICE_LIFETIME_MS;
}
