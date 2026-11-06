import { encodeBytes } from "@getahoy/crypto";
import type { ErrorCode, RequestError } from "@getahoy/lib";
import { loadDeviceKeys } from "@/features/pairing/storage/deviceKeys";
import { sendHistoryWrites } from "../client/historyApi";
import { markSent, pendingBatch } from "../historyOutbox";
import { readOutbox, updateOutbox } from "../storage/historyStore";

// The server will never take these, so retrying would block every later entry.
const REFUSED_FOR_GOOD: readonly ErrorCode[] = [
  "invalid_input",
  "forbidden",
  "not_found",
];

function refusedForGood(error: RequestError): boolean {
  return error.kind === "api" && REFUSED_FOR_GOOD.includes(error.detail.code);
}

async function drain(): Promise<void> {
  const keys = await loadDeviceKeys();
  const phoneKey = encodeBytes(keys.publicKey);
  for (;;) {
    const entries = pendingBatch(readOutbox());
    if (entries.length === 0) return;
    const sent = await sendHistoryWrites({ phoneKey, entries });
    if (sent.code === "error" && !refusedForGood(sent.error)) return;
    updateOutbox((outbox) => markSent(outbox, entries));
  }
}

let flushing: Promise<void> | null = null;

export function flushHistory(): Promise<void> {
  flushing ??= drain()
    .catch(() => undefined)
    .finally(() => {
      flushing = null;
    });
  return flushing;
}
