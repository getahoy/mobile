import { Keyframe, ReduceMotion } from "react-native-reanimated";
import { duration, easing } from "@/lib/motion";

const RISE_PX = 12;
const LEAVE_PX = -6;

const rise = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: RISE_PX }] },
  100: { opacity: 1, transform: [{ translateY: 0 }], easing: easing.out },
}).duration(duration.slow);

const leave = new Keyframe({
  0: { opacity: 1, transform: [{ translateY: 0 }] },
  100: {
    opacity: 0,
    transform: [{ translateY: LEAVE_PX }],
    easing: easing.out,
  },
}).duration(duration.slow);

const fadeIn = new Keyframe({ 0: { opacity: 0 }, 100: { opacity: 1 } })
  .duration(duration.slow)
  .reduceMotion(ReduceMotion.Never);

const fadeOut = new Keyframe({ 0: { opacity: 1 }, 100: { opacity: 0 } })
  .duration(duration.slow)
  .reduceMotion(ReduceMotion.Never);

export function endedMotion(reducedMotion: boolean) {
  if (reducedMotion) return { entering: fadeIn, exiting: fadeOut };
  return { entering: rise, exiting: leave };
}
