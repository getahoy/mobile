import { errorMessages } from "@getahoy/lib";
import { useEffect, useRef, useState } from "react";
import { pairingCopy } from "../copy/pairingCopy";
import {
  type ClaimOutcome,
  claimScannedCode,
} from "../enrollment/claimScannedCode";
import { finishPairing } from "../enrollment/finishPairing";
import { usePairedMacsChanges } from "./usePairedMacsChanges";

const PAIRED_CONFIRMATION_MS = 1000;

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

export function useClaimMac(onPaired: () => void) {
  const [state, setState] = useState<ClaimState>({ kind: "scanning" });
  const busy = useRef(false);
  const pairedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const changes = usePairedMacsChanges();

  useEffect(
    () => () => {
      if (pairedTimer.current) clearTimeout(pairedTimer.current);
    },
    [],
  );

  const claim = async (scanned: string) => {
    if (busy.current) return;
    busy.current = true;
    setState({ kind: "claiming" });
    const outcome = await claimScannedCode(scanned).catch(
      () => UNEXPECTED_FAILURE,
    );
    if (outcome.kind === "failed") {
      setState({ kind: "failed", message: outcome.message });
      return;
    }
    setState({ kind: "finishing" });
    const finished = await finishPairing(outcome.mac).catch(() => false);
    if (!finished) {
      setState({ kind: "failed", message: pairingCopy["pair.notFinished"] });
      return;
    }
    setState({ kind: "paired", macName: outcome.mac.displayName });
    changes.announce();
    pairedTimer.current = setTimeout(onPaired, PAIRED_CONFIRMATION_MS);
  };

  const scanAgain = () => {
    busy.current = false;
    setState({ kind: "scanning" });
  };

  return { state, claim, scanAgain };
}
