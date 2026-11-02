import { macCopy } from "./copy/macCopy";
import { pairingCopy } from "./copy/pairingCopy";
import type { ScannerFailure, ScannerState } from "./scannerFlow";

export type FailureAction = "tryAgain" | "scanAgain" | "signIn";

const failureCopy = {
  unreachable: "pair.unreachable",
  alreadyUsed: "pair.alreadyUsed",
  rateLimited: "pair.rateLimited",
  signIn: "pair.signIn",
  updateApp: "pair.updateApp",
  refused: "pair.refused",
  notFinished: "pair.notFinished",
} as const satisfies Record<ScannerFailure, keyof typeof pairingCopy>;

const noticeCopy = {
  notAhoy: "scan.notAhoy",
  expired: "scan.expired",
} as const;

export function failureAction(failure: ScannerFailure): FailureAction {
  if (failure === "unreachable") return "tryAgain";
  if (failure === "signIn") return "signIn";
  return "scanAgain";
}

export function scannerMessage(state: ScannerState, hint: string): string {
  switch (state.kind) {
    case "scanning":
      if (state.notice === null) return hint;
      return pairingCopy[noticeCopy[state.notice]];
    case "claiming":
      return pairingCopy["pair.claiming"];
    case "finishing":
      return pairingCopy["pair.finishing"];
    case "paired":
      return macCopy.pairedWith(state.macName);
    case "failed":
      return pairingCopy[failureCopy[state.failure]];
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}
