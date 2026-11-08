import Animated, { FadeIn } from "react-native-reanimated";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { duration } from "@/lib/motion";

const textFade = FadeIn.duration(duration.fast);

type HistorySummaryProps = { text: string | null; pending: boolean };

export function HistorySummary({ text, pending }: HistorySummaryProps) {
  if (text) {
    return (
      <Animated.View entering={textFade} className="px-1 pt-1">
        <Text className="font-fraunces text-summary">{text}</Text>
      </Animated.View>
    );
  }
  if (!pending) return null;
  return <Skeleton className="mx-1 mt-1 h-6 w-7/10" />;
}
