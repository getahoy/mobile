import { errorMessages } from "@getahoy/lib";
import { useEffect, useRef, useState } from "react";
import { pairingCopy } from "../copy/pairingCopy";
import {
  type ClaimOutcome,
  claimScannedCode,
  readScannedCode,
} from "../enrollment/claimScannedCode";
import { finishPairing } from "../enrollment/finishPairing";
import { usePairedMacsChanges } from "./usePairedMacsChanges";

const PAIRED_CONFIRMATION_MS = 1000;
// The rejected code is usually still in view; this paces retries of it.
const SAME_CODE_RETRY_MS = 3000;

const UNEXPECTED_FAILURE: ClaimOutcome = {
  kind: "failed",
  message: errorMessages.internal,
};

export type ClaimState =
  | { kind: "scanning" }
  | { kind: "claiming" }
  | { kind: "finishing" }
  | { kind: "paired"; macName: string }
  | { kind: "failed"; message: string };

type Rejection = { code: string; at: number };

export function useClaimMac(onPaired: () => void) {
  const [state, setState] = useState<ClaimState>({ kind: "scanning" });
  const busy = useRef(false);
  const rejected = useRef<Rejection | null>(null);
  const pairedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const changes = usePairedMacsChanges();

  useEffect(
    () => () => {
      if (pairedTimer.current) clearTimeout(pairedTimer.current);
    },
    [],
  );

  const recentlyRejected = (code: string) => {
    const last = rejected.current;
    if (!last || last.code !== code) return false;
    return Date.now() - last.at < SAME_CODE_RETRY_MS;
  };

  const reject = (code: string, message: string) => {
    rejected.current = { code, at: Date.now() };
    busy.current = false;
    setState({ kind: "failed", message });
  };

  const claim = async (scanned: string) => {
    if (busy.current || recentlyRejected(scanned)) return;
    const read = readScannedCode(scanned);
    if (read.kind === "failed") return reject(scanned, read.message);
    busy.current = true;
    setState({ kind: "claiming" });
    const outcome = await claimScannedCode(read.qr).catch(
      () => UNEXPECTED_FAILURE,
    );
    if (outcome.kind === "failed") return reject(scanned, outcome.message);
    setState({ kind: "finishing" });
    const finished = await finishPairing(outcome.mac).catch(() => false);
    if (!finished) return reject(scanned, pairingCopy["pair.notFinished"]);
    setState({ kind: "paired", macName: outcome.mac.displayName });
    changes.announce();
    pairedTimer.current = setTimeout(onPaired, PAIRED_CONFIRMATION_MS);
  };

  return { state, claim };
}
