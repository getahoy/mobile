import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

type ScannerChipProps = { children: ReactNode; tone: "hint" | "alert" };

export function ScannerChip({ children, tone }: ScannerChipProps) {
  return (
    <View className="self-center rounded-card bg-night px-4 py-2.5">
      <Text
        variant="bodySmall"
        role={tone === "alert" ? "alert" : undefined}
        className="text-center text-on-scrim"
      >
        {children}
      </Text>
    </View>
  );
}
