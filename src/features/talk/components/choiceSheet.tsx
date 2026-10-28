import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import type { TalkState } from "../talkState";
import { ChoiceButtons } from "./choiceButtons";
import { SheetBackground } from "./sheetBackground";

type ChoiceSheetProps = {
  state: TalkState;
  onChoose: (number: number) => void;
  onDismiss: () => void;
};

const CLOSED = -1;

export function ChoiceSheet({ state, onChoose, onDismiss }: ChoiceSheetProps) {
  const sheet = useRef<BottomSheet>(null);
  const choosing = state.kind === "answered" && state.choices.length > 0;
  const choices = choosing ? state.choices : [];
  const message = choosing ? state.message : "";
  const confirm = choosing && state.confirm;

  useEffect(() => {
    if (choosing) sheet.current?.snapToIndex(0);
    else sheet.current?.close();
  }, [choosing]);

  return (
    <BottomSheet
      ref={sheet}
      index={CLOSED}
      enablePanDownToClose
      enableDynamicSizing
      onClose={onDismiss}
      backgroundComponent={SheetBackground}
    >
      <BottomSheetScrollView>
        <View className="gap-3 px-6 pt-2 pb-safe-offset-6">
          <Text className="text-lg font-semibold">{message}</Text>
          <ChoiceButtons
            choices={choices}
            confirm={confirm}
            onChoose={onChoose}
            onCancel={onDismiss}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
