import { View } from "react-native";
import { cn } from "@/lib/cn";
import { MockFade } from "./mockFade";

type MockRadioProps = { selected: boolean };

export function MockRadio({ selected }: MockRadioProps) {
  return (
    <View
      className={cn(
        "size-4.5 rounded-full border-2",
        selected ? "border-signal" : "border-fog",
      )}
    >
      <MockFade
        shown={selected}
        speed="fast"
        className="absolute inset-0.5 rounded-full bg-signal"
      />
    </View>
  );
}
