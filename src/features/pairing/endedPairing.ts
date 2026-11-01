import type { EndReason } from "@getahoy/protocol";
import { macCopy } from "./copy/macCopy.ts";

type Ending = { reason: EndReason; at: number; whileClosed: boolean };

export type EndedNotice = Ending & { deviceName: string };

type NamedMac = { publicKey: string; displayName: string };

type Ended<T> = { macs: T[]; notice: EndedNotice };

type StoredEnd = { reason: EndReason; at: number } | null;

export type NoticeAge =
  | { kind: "justNow" }
  | { kind: "minutes"; count: number }
  | { kind: "hours"; count: number };

const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const HOURS_SHOWN = 24;
export const NOTICE_LIFETIME_MS =
  HOURS_SHOWN * MINUTES_PER_HOUR * MS_PER_MINUTE;

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

export function noticeShown(notice: EndedNotice, now: number): boolean {
  return now - notice.at < NOTICE_LIFETIME_MS;
}

export function endedWhen(notice: EndedNotice, now: number): string {
  const copy = macCopy.endedWhen;
  const age = noticeAge(notice.at, now);
  const when =
    age.kind === "justNow"
      ? copy.justNow
      : age.kind === "minutes"
        ? copy.minutes(age.count)
        : copy.hours(age.count);
  return notice.whileClosed ? copy.whileClosed(when) : when;
}

export function noticeAge(at: number, now: number): NoticeAge {
  const minutes = Math.floor((now - at) / MS_PER_MINUTE);
  if (minutes < 1) return { kind: "justNow" };
  if (minutes < MINUTES_PER_HOUR) return { kind: "minutes", count: minutes };
  return { kind: "hours", count: Math.floor(minutes / MINUTES_PER_HOUR) };
}
