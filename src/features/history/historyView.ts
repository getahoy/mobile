import type { HistoryEntry, HistoryTimings } from "@getahoy/protocol";
import { historyCopy } from "./copy/historyCopy.ts";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_WINDOW_DAYS = 6;
const MS_PER_SECOND = 1000;

export type HistorySection = { title: string; data: HistoryEntry[] };

export type TimingSegment = {
  label: string;
  ms: number;
  tone: "ink" | "driftwood" | "fog";
};

function startOfDay(at: Date): number {
  return new Date(at.getFullYear(), at.getMonth(), at.getDate()).getTime();
}

export function dayLabel(at: Date, now: Date): string {
  const daysAgo = Math.round((startOfDay(now) - startOfDay(at)) / DAY_MS);
  if (daysAgo === 0) return historyCopy.today;
  if (daysAgo === 1) return historyCopy.yesterday;
  if (daysAgo <= WEEKDAY_WINDOW_DAYS) {
    return at.toLocaleDateString(undefined, { weekday: "long" });
  }
  const sameYear = at.getFullYear() === now.getFullYear();
  return at.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

export function timeLabel(at: Date): string {
  return at.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function sectionsByDay(
  entries: readonly HistoryEntry[],
  now: Date,
): HistorySection[] {
  const sections: HistorySection[] = [];
  for (const entry of entries) {
    const title = dayLabel(new Date(entry.startedAt), now);
    const last = sections.at(-1);
    if (last?.title === title) last.data.push(entry);
    else sections.push({ title, data: [entry] });
  }
  return sections;
}

// History keeps the words, not the action, so the words decide what deserves a second look.
const RISKY_WORDS = /\b(close|quit|exit|e-?mail|mail|draft)\b/i;

export function needsRunConfirm(heard: string): boolean {
  return RISKY_WORDS.test(heard);
}

export function reportLines(entry: HistoryEntry) {
  const timings = timingSegments(entry.timings)
    .map((segment) => `${segment.label} ${seconds(segment.ms)}s`)
    .join(" · ");
  const fields = historyCopy.reportFields;
  const lines: [string, string | null][] = [
    [fields.heard, entry.heard],
    [fields.did, entry.did],
    [fields.status, entry.status],
    [fields.app, entry.app],
    [fields.reason, entry.reason],
    [fields.timings, timings || null],
  ];
  return lines.flatMap(([label, text]) => (text ? [{ label, text }] : []));
}

type NoticeInput = { offline: boolean; waiting: number; stale: boolean };

export function listNotice({ offline, waiting, stale }: NoticeInput) {
  if (offline) return historyCopy.offline(waiting);
  return stale ? historyCopy.couldNotRefresh : null;
}

type Summary = { lastSevenDays: number; didntGoThrough: number };

export function summaryLine(summary: Summary | null): string | null {
  if (!summary) return null;
  return historyCopy.summary(summary.lastSevenDays, summary.didntGoThrough);
}

type MetaInput = {
  entry: HistoryEntry;
  unsynced: ReadonlySet<string>;
  showMac: boolean;
};

export function entryMeta({ entry, unsynced, showMac }: MetaInput) {
  const waiting = unsynced.has(entry.id) && entry.status !== "running";
  const parts = [
    showMac ? entry.macName : null,
    waiting ? historyCopy.notSynced : null,
  ].filter((part) => part !== null);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function seconds(ms: number): string {
  return (ms / MS_PER_SECOND).toFixed(1);
}

export function timingSegments(timings: HistoryTimings): TimingSegment[] {
  const parts: [string, number | undefined, TimingSegment["tone"]][] = [
    [historyCopy.hearing, timings.hearingMs, "ink"],
    [historyCopy.understanding, timings.understandingMs, "driftwood"],
    [historyCopy.onMac, timings.onMacMs, "fog"],
  ];
  return parts.flatMap(([label, ms, tone]) =>
    ms === undefined ? [] : [{ label, ms, tone }],
  );
}

export function totalMs(timings: HistoryTimings): number | null {
  const segments = timingSegments(timings);
  if (segments.length === 0) return null;
  return segments.reduce((total, segment) => total + segment.ms, 0);
}

export function whyOf(entry: HistoryEntry) {
  const { why } = historyCopy;
  switch (entry.status) {
    case "failed": {
      const text = why[entry.reason ?? "other"];
      return { label: historyCopy.whyFailed, text };
    }
    case "blocked": {
      const text = why[entry.reason ?? "blockedApp"];
      return { label: historyCopy.whyBlocked, text };
    }
    case "cancelled": {
      const text = historyCopy.cancelledWhy;
      return { label: historyCopy.whyCancelled, text };
    }
    case "running":
    case "done":
    case "choice":
      return null;
    default: {
      const unhandled: never = entry.status;
      return unhandled;
    }
  }
}
