import type { ReactNode } from "react";
import { View } from "react-native";
import { useAnnounceChange } from "../hooks/useAnnounceChange";
import type { ScannerState } from "../scannerFlow";
import { type FailureAction, scannerMessage } from "../scannerMessage";
import { ScannerSlotContent } from "./scannerSlotContent";

export type ScannerHint = { label: string; content: ReactNode };

type ScannerMessageSlotProps = {
  state: ScannerState;
  hint: ScannerHint;
  signingIn: boolean;
  onAction: (action: FailureAction) => void;
};

export function ScannerMessageSlot({
  state,
  hint,
  signingIn,
  onAction,
}: ScannerMessageSlotProps) {
  const text = scannerMessage(state, hint.label);
  useAnnounceChange(text);
  return (
    <View className="absolute inset-x-0 bottom-0 px-6 pb-safe-offset-10">
      <ScannerSlotContent
        state={state}
        text={text}
        hint={hint.content}
        signingIn={signingIn}
        onAction={onAction}
      />
    </View>
  );
}
