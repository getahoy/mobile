import Animated, { FadeIn } from "react-native-reanimated";
import { duration } from "@/lib/motion";
import type { HistoryScreenState } from "../hooks/useHistoryScreen";
import { HistoryFeed } from "./historyFeed";
import { HistoryLoading } from "./historyLoading";

const listFade = FadeIn.duration(duration.base);

// The header stays; until something can be shown, the waiting state takes the list's place.
export function HistoryBody({ screen }: { screen: HistoryScreenState }) {
  const { firstLoad } = screen;
  if (firstLoad.showLoader) return <HistoryLoading busy={firstLoad.busy} />;
  const fade = firstLoad.fadeIn ? { entering: listFade } : {};
  return (
    <Animated.View {...fade} className="flex-1">
      <HistoryFeed screen={screen} />
    </Animated.View>
  );
}
