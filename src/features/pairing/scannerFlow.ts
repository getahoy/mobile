import type { PairingQr } from "@getahoy/protocol";
import type { ClaimFailure } from "./enrollment/claimFailure.ts";
import { qrExpired, readScannedCode } from "./enrollment/readScannedCode.ts";

export const SCAN_NOTICE_MS = 3000;

type ScanNotice = "notAhoy" | "expired";
export type ScannerFailure = ClaimFailure | "notFinished";

type Rejected = { code: string; at: number };
type Pending = { qr: PairingQr; code: string };

export type ScannerState =
  | { kind: "scanning"; notice: ScanNotice | null; rejected: Rejected | null }
  | ({ kind: "claiming" } & Pending)
  | ({ kind: "finishing" } & Pending)
  | { kind: "paired"; macName: string }
  | ({ kind: "failed"; failure: ScannerFailure } & Pending);

export type ScannerEvent =
  | { kind: "scanned"; code: string; now: number }
  | { kind: "noticeTimedOut" }
  | { kind: "claimed" }
  | { kind: "claimFailed"; failure: ClaimFailure }
  | { kind: "finished"; macName: string }
  | { kind: "notFinished" }
  | { kind: "retried"; now: number }
  | { kind: "scanAgain"; now: number };

type Scanning = Extract<ScannerState, { kind: "scanning" }>;

export const SCANNING: Scanning = {
  kind: "scanning",
  notice: null,
  rejected: null,
};

const recent = (rejected: Rejected | null, code: string, now: number) =>
  rejected?.code === code && now - rejected.at < SCAN_NOTICE_MS;

function scanned(state: Scanning, code: string, now: number): ScannerState {
  if (recent(state.rejected, code, now)) return state;
  const read = readScannedCode(code, now);
  if (read.kind === "read") return { kind: "claiming", qr: read.qr, code };
  return { kind: "scanning", notice: read.kind, rejected: { code, at: now } };
}

function retried(state: ScannerState, now: number): ScannerState {
  if (state.kind !== "failed" || state.failure !== "unreachable") return state;
  const { qr, code } = state;
  if (!qrExpired(qr, now)) return { kind: "claiming", qr, code };
  return { kind: "scanning", notice: "expired", rejected: { code, at: now } };
}

function settled(state: ScannerState, event: ScannerEvent): ScannerState {
  if (event.kind === "claimed" && state.kind === "claiming") {
    return { ...state, kind: "finishing" };
  }
  if (event.kind === "claimFailed" && state.kind === "claiming") {
    return { ...state, kind: "failed", failure: event.failure };
  }
  if (event.kind === "finished" && state.kind === "finishing") {
    return { kind: "paired", macName: event.macName };
  }
  if (event.kind === "notFinished" && state.kind === "finishing") {
    return { ...state, kind: "failed", failure: "notFinished" };
  }
  return state;
}

export function nextScannerState(
  state: ScannerState,
  event: ScannerEvent,
): ScannerState {
  switch (event.kind) {
    case "scanned":
      if (state.kind !== "scanning") return state;
      return scanned(state, event.code, event.now);
    case "noticeTimedOut":
      if (state.kind !== "scanning" || state.notice === null) return state;
      return { ...state, notice: null };
    case "claimed":
    case "claimFailed":
    case "finished":
    case "notFinished":
      return settled(state, event);
    case "retried":
      return retried(state, event.now);
    case "scanAgain":
      if (state.kind !== "failed") return state;
      return { ...SCANNING, rejected: { code: state.code, at: event.now } };
    default: {
      const unhandled: never = event;
      return unhandled;
    }
  }
}
