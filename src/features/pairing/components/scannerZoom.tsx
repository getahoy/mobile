import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { duration, useReducedMotion } from "@/lib/motion";
import { pairingCopy } from "../copy/pairingCopy";
import type { ScannerZoomState } from "../hooks/useScannerZoom";
import { zoomLimitReached } from "../zoomScale";
import { ZoomStepButton } from "./zoomStepButton";
import { ZoomTrack } from "./zoomTrack";

type ScannerZoomProps = { zoom: ScannerZoomState; visible: boolean };

export function ScannerZoom({ zoom, visible }: ScannerZoomProps) {
  const reducedMotion = useReducedMotion();
  const fade = useAnimatedStyle(() => ({
    opacity: withTiming(visible ? 1 : 0, {
      duration: reducedMotion ? 0 : duration.fast,
    }),
  }));
  return (
    <Animated.View
      style={fade}
      pointerEvents={visible ? "box-none" : "none"}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? "auto" : "no-hide-descendants"}
      className="absolute inset-y-0 right-safe-offset-4 justify-center"
    >
      <GestureDetector gesture={zoom.drag}>
        <View className="w-11 items-center rounded-full bg-scrim">
          <ZoomStepButton
            icon="plus"
            label={pairingCopy["scanner.zoomIn"]}
            disabled={zoomLimitReached(zoom.level, "in")}
            onStep={() => zoom.step("in", "ease")}
          />
          <ZoomTrack
            level={zoom.level}
            liveLevel={zoom.liveLevel}
            onAdjust={(direction) => zoom.step(direction, "jump")}
            onLayout={zoom.onTrackLayout}
          />
          <ZoomStepButton
            icon="minus"
            label={pairingCopy["scanner.zoomOut"]}
            disabled={zoomLimitReached(zoom.level, "out")}
            onStep={() => zoom.step("out", "ease")}
          />
        </View>
      </GestureDetector>
    </Animated.View>
  );
}
