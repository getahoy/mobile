import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type AppearanceRadioProps = { selected: boolean };

export function AppearanceRadio({ selected }: AppearanceRadioProps) {
  return (
    <View
      aria-hidden
      className={cn(
        "size-5 items-center justify-center rounded-full border-[1.5px]",
        selected ? "border-ink bg-ink" : "border-rope",
      )}
    >
      {selected ? (
        <Icon name="check" size="xs" tintColorClassName="accent-on-ink" />
      ) : null}
    </View>
  );
}
