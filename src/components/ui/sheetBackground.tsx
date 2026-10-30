import type { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { View } from "react-native";

export function SheetBackground({ style }: BottomSheetBackgroundProps) {
  return (
    <View
      pointerEvents="none"
      style={style}
      className="rounded-t-sheet bg-paper shadow-float"
    />
  );
}
