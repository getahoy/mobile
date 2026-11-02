import { View } from "react-native";
import { cn } from "@/lib/cn";

type ScannerViewfinderProps = { dimmed: boolean };

const brackets = [
  "top-0 left-0 rounded-tl-viewfinder-bracket border-t-4 border-l-4",
  "top-0 right-0 rounded-tr-viewfinder-bracket border-t-4 border-r-4",
  "bottom-0 left-0 rounded-bl-viewfinder-bracket border-b-4 border-l-4",
  "right-0 bottom-0 rounded-br-viewfinder-bracket border-r-4 border-b-4",
];

export function ScannerViewfinder({ dimmed }: ScannerViewfinderProps) {
  return (
    <View
      className="absolute inset-0 items-center justify-center"
      pointerEvents="none"
    >
      <View className="absolute rounded-viewfinder-scrim border-(length:--spacing-viewfinder-reach) border-scrim">
        <View className="size-viewfinder" />
      </View>
      <View className={cn("p-viewfinder-gap", dimmed && "opacity-50")}>
        <View className="size-viewfinder" />
        {brackets.map((placement) => (
          <View
            key={placement}
            className={`absolute size-10 border-on-scrim ${placement}`}
          />
        ))}
      </View>
    </View>
  );
}
