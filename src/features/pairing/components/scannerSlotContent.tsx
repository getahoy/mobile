import type { ReactNode } from "react";
import type { ScannerState } from "../scannerFlow";
import { type FailureAction, failureAction } from "../scannerMessage";
import { ScannerChip } from "./scannerChip";
import { ScannerFailureCard } from "./scannerFailureCard";
import { ScannerPairedCard } from "./scannerPairedCard";
import { ScannerProgress } from "./scannerProgress";

type ScannerSlotContentProps = {
  state: ScannerState;
  text: string;
  hint: ReactNode;
  signingIn: boolean;
  onAction: (action: FailureAction) => void;
};

export function ScannerSlotContent({
  state,
  text,
  hint,
  signingIn,
  onAction,
}: ScannerSlotContentProps) {
  switch (state.kind) {
    case "scanning":
      if (state.notice === null) {
        return <ScannerChip tone="hint">{hint}</ScannerChip>;
      }
      return <ScannerChip tone="alert">{text}</ScannerChip>;
    case "claiming":
    case "finishing":
      return <ScannerProgress text={text} />;
    case "paired":
      return <ScannerPairedCard text={text} />;
    case "failed": {
      const action = failureAction(state.failure);
      return (
        <ScannerFailureCard
          text={text}
          action={action}
          pending={action === "signIn" && signingIn}
          onAction={() => onAction(action)}
        />
      );
    }
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}
