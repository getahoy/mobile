import { encodeBytes } from "@getahoy/crypto";
import type { ErrorCode, RequestError } from "@getahoy/lib";
import type { HistoryWriteEntry } from "@getahoy/protocol";
import { logger } from "@/features/logging/logger";
import { loadDeviceKeys } from "@/features/pairing/storage/deviceKeys";
import { sendHistoryWrites } from "../client/historyApi";
import { markRejected, markSent, pendingBatch } from "../historyOutbox";
import { readOutbox, updateOutbox } from "../storage/historyStore";

// The server will never take these as they are, so retrying would block every later entry.
const REFUSED_FOR_GOOD: readonly ErrorCode[] = [
  "invalid_input",
  "forbidden",
  "not_found",
];

type Sent = "sent" | "refused" | "unreachable";

function outcomeOf(error: RequestError): Sent {
  if (error.kind !== "api") return "unreachable";
  const forGood = REFUSED_FOR_GOOD.includes(error.detail.code);
  return forGood ? "refused" : "unreachable";
}

// Only the error code and the field path: never what was said.
function reportRefusal(error: RequestError): void {
  if (!__DEV__ || error.kind !== "api") return;
  const { code, field } = error.detail;
  const where = field ? ` at ${field}` : "";
  logger.warn("history", `Upload refused: ${code}${where}`);
}

async function send(
  phoneKey: string,
  entries: HistoryWriteEntry[],
): Promise<Sent> {
  const sent = await sendHistoryWrites({ phoneKey, entries });
  if (sent.code === "success") {
    updateOutbox((outbox) => markSent(outbox, entries));
    return "sent";
  }
  const outcome = outcomeOf(sent.error);
  if (outcome === "refused") reportRefusal(sent.error);
  return outcome;
}

// One refused entry must not hold back the rest, so a refused batch is sent one by one.
async function sendOneByOne(phoneKey: string, entries: HistoryWriteEntry[]) {
  for (const entry of entries) {
    const outcome = await send(phoneKey, [entry]);
    if (outcome === "unreachable") return false;
    if (outcome === "refused") {
      updateOutbox((outbox) => markRejected(outbox, [entry]));
    }
  }
  return true;
}

// Loading the keys creates them on a fresh install, so nothing is loaded until there is work.
async function drain(): Promise<void> {
  if (pendingBatch(readOutbox()).length === 0) return;
  const keys = await loadDeviceKeys();
  const phoneKey = encodeBytes(keys.publicKey);
  for (;;) {
    const entries = pendingBatch(readOutbox());
    if (entries.length === 0) return;
    const outcome = await send(phoneKey, entries);
    if (outcome === "unreachable") return;
    if (outcome !== "refused") continue;
    if (entries.length === 1) {
      updateOutbox((outbox) => markRejected(outbox, entries));
    } else if (!(await sendOneByOne(phoneKey, entries))) {
      return;
    }
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
