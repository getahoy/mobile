import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";

type GuideStepProps = { number: number; text: string; active: boolean };

export function GuideStep({ number, text, active }: GuideStepProps) {
  return (
    <View role="listitem" className="flex-row items-start gap-3">
      <View
        className={cn(
          "size-5.5 items-center justify-center rounded-full",
          active && "bg-ink",
        )}
      >
        <Text
          className={cn(
            "font-mono text-eyebrow",
            active ? "text-on-ink" : "text-driftwood",
          )}
        >
          {number}
        </Text>
      </View>
      <Text
        variant="bodySmall"
        className={cn("flex-1 pt-px", active ? "text-ink" : "text-driftwood")}
      >
        {text}
      </Text>
    </View>
  );
}
