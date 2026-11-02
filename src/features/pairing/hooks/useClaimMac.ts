import type { PairingQr } from "@getahoy/protocol";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ClaimOutcome,
  claimScannedCode,
} from "../enrollment/claimScannedCode";
import { finishPairing } from "../enrollment/finishPairing";
import {
  nextScannerState,
  SCAN_NOTICE_MS,
  SCANNING,
  type ScannerEvent,
  type ScannerState,
} from "../scannerFlow";
import { usePairedMacsChanges } from "./usePairedMacsChanges";

const UNEXPECTED_FAILURE: ClaimOutcome = { kind: "failed", failure: "refused" };

export function useClaimMac() {
  const [state, setState] = useState<ScannerState>(SCANNING);
  const current = useRef(state);
  const changes = usePairedMacsChanges();

  const dispatch = useCallback((event: ScannerEvent) => {
    const next = nextScannerState(current.current, event);
    if (next === current.current) return null;
    current.current = next;
    setState(next);
    return next;
  }, []);

  useEffect(() => {
    if (state.kind !== "scanning" || state.notice === null) return;
    const timedOut = () => dispatch({ kind: "noticeTimedOut" });
    const timer = setTimeout(timedOut, SCAN_NOTICE_MS);
    return () => clearTimeout(timer);
  }, [state, dispatch]);

  const pair = async (qr: PairingQr) => {
    const outcome = await claimScannedCode(qr).catch(() => UNEXPECTED_FAILURE);
    if (outcome.kind === "failed") {
      dispatch({ kind: "claimFailed", failure: outcome.failure });
      return;
    }
    dispatch({ kind: "claimed" });
    const finished = await finishPairing(outcome.mac).catch(() => false);
    if (!finished) {
      dispatch({ kind: "notFinished" });
      return;
    }
    dispatch({ kind: "finished", macName: outcome.mac.displayName });
    changes.announce();
  };

  const start = (event: ScannerEvent) => {
    const next = dispatch(event);
    if (next?.kind === "claiming") void pair(next.qr);
  };

  return {
    state,
    scan: (code: string) => start({ kind: "scanned", code, now: Date.now() }),
    retry: () => start({ kind: "retried", now: Date.now() }),
    scanAgain: () => dispatch({ kind: "scanAgain", now: Date.now() }),
  };
}
