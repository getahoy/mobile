import type { HandshakeOutcome } from "./macHandshake";

export type HandshakeMiss = Exclude<HandshakeOutcome, { outcome: "connected" }>;

// A stale address can belong to another device or another Mac running Ahoy,
// so "unrecognised" wins only when no address gave a stronger answer.
const STRENGTH: readonly HandshakeMiss["outcome"][] = [
  "ended",
  "macTooOld",
  "macTooNew",
  "unrecognised",
  "unreachable",
];

const UNREACHABLE: HandshakeMiss = { outcome: "unreachable" };

export function handshakeVerdict(
  misses: readonly HandshakeMiss[],
): HandshakeMiss {
  for (const kind of STRENGTH) {
    const strongest = misses.find((miss) => miss.outcome === kind);
    if (strongest) return strongest;
  }
  return UNREACHABLE;
}
