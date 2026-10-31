import { View } from "react-native";
import { Text } from "@/components/ui/text";

type ScannerViewfinderProps = { hint: string };

const corners = [
  "top-0 left-0 rounded-tl-card border-t-4 border-l-4",
  "top-0 right-0 rounded-tr-card border-t-4 border-r-4",
  "bottom-0 left-0 rounded-bl-card border-b-4 border-l-4",
  "right-0 bottom-0 rounded-br-card border-r-4 border-b-4",
];

// Each ring's inner edge has the card radius, so the scrim follows the bracket curves.
const fillets = [
  { box: "top-0 left-0", ring: "-top-6 -left-6" },
  { box: "top-0 right-0", ring: "-top-6 -left-12" },
  { box: "bottom-0 left-0", ring: "-top-12 -left-6" },
  { box: "right-0 bottom-0", ring: "-top-12 -left-12" },
];

export function ScannerViewfinder({ hint }: ScannerViewfinderProps) {
  return (
    <View className="absolute inset-0" pointerEvents="none">
      <View className="flex-1 bg-scrim" />
      <View className="flex-row">
        <View className="flex-1 bg-scrim" />
        <View className="size-viewfinder">
          {fillets.map(({ box, ring }) => (
            <View
              key={box}
              className={`absolute size-6 overflow-hidden ${box}`}
            >
              <View
                className={`absolute size-24 rounded-full border-24 border-scrim ${ring}`}
              />
            </View>
          ))}
          {corners.map((placement) => (
            <View
              key={placement}
              className={`absolute size-10 border-on-scrim ${placement}`}
            />
          ))}
        </View>
        <View className="flex-1 bg-scrim" />
      </View>
      <View className="flex-1 justify-end bg-scrim px-6 pb-safe-offset-10">
        <View className="self-center rounded-card bg-night px-4 py-2.5">
          <Text variant="bodySmall" className="text-center text-on-scrim">
            {hint}
          </Text>
        </View>
      </View>
    </View>
  );
}
