import { errorMessages } from "@getahoy/lib";
import { useRef, useState } from "react";
import {
  type ClaimOutcome,
  claimScannedCode,
} from "../enrollment/claimScannedCode";

const UNEXPECTED_FAILURE: ClaimOutcome = {
  kind: "failed",
  message: errorMessages.internal,
};

type ClaimState =
  | { kind: "scanning" }
  | { kind: "claiming" }
  | { kind: "failed"; message: string };

export function useClaimMac(onPaired: () => void) {
  const [state, setState] = useState<ClaimState>({ kind: "scanning" });
  const busy = useRef(false);

  const claim = async (scanned: string) => {
    if (busy.current) return;
    busy.current = true;
    setState({ kind: "claiming" });
    const outcome = await claimScannedCode(scanned).catch(
      () => UNEXPECTED_FAILURE,
    );
    if (outcome.kind === "paired") {
      onPaired();
      return;
    }
    setState({ kind: "failed", message: outcome.message });
  };

  const scanAgain = () => {
    busy.current = false;
    setState({ kind: "scanning" });
  };

  return { state, claim, scanAgain };
}
