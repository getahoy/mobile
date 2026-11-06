import { historyPageSchema, historyWriteSchema } from "@getahoy/protocol";
import { createMMKV } from "react-native-mmkv";
import { z } from "zod";
import type { Outbox } from "../historyOutbox";

export const OUTBOX_KEY = "history.outbox";
const CACHE_KEY = "history.cache";
const KEEP_KEY = "history.keep";
const CACHED_ENTRIES = 50;

export const historyStorage = createMMKV({ id: "ahoy.history" });

const outboxSchema = z.record(
  z.string(),
  z.object({
    entry: historyWriteSchema.shape.entries.element,
    sentRev: z.int().min(0),
    rejectedRev: z.int().min(0).default(0),
  }),
);

const cacheSchema = historyPageSchema.pick({ entries: true, summary: true });

type HistoryCache = z.infer<typeof cacheSchema>;

const emptyCache: HistoryCache = { entries: [], summary: null };

function parseJson<T>(text: string | undefined, schema: z.ZodType<T>) {
  if (text === undefined) return null;
  try {
    const parsed = schema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

const readJson = <T>(key: string, schema: z.ZodType<T>) =>
  parseJson(historyStorage.getString(key), schema);

export function parseOutbox(text: string | undefined): Outbox {
  return parseJson(text, outboxSchema) ?? {};
}

export function readOutbox(): Outbox {
  return parseOutbox(historyStorage.getString(OUTBOX_KEY));
}

export function removeFromOutbox(id: string): void {
  updateOutbox(({ [id]: _, ...rest }) => rest);
}

export function updateOutbox(change: (outbox: Outbox) => Outbox): void {
  historyStorage.set(OUTBOX_KEY, JSON.stringify(change(readOutbox())));
}

export function readHistoryCache(): HistoryCache {
  return readJson(CACHE_KEY, cacheSchema) ?? emptyCache;
}

export function writeHistoryCache({ entries, summary }: HistoryCache): void {
  const kept = { entries: entries.slice(0, CACHED_ENTRIES), summary };
  historyStorage.set(CACHE_KEY, JSON.stringify(kept));
}

export function keepsHistory(): boolean {
  return historyStorage.getBoolean(KEEP_KEY) ?? true;
}

export function rememberKeepHistory(keep: boolean): void {
  historyStorage.set(KEEP_KEY, keep);
}

export function clearHistoryStorage(): void {
  historyStorage.clearAll();
}

export function clearHistoryEntries(): void {
  historyStorage.remove(OUTBOX_KEY);
  historyStorage.remove(CACHE_KEY);
}
