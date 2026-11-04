import {
  AndroidHaptics,
  ImpactFeedbackStyle,
  impactAsync,
  NotificationFeedbackType,
  notificationAsync,
  performAndroidHapticsAsync,
  selectionAsync,
} from "expo-haptics";
import { AppState, Platform } from "react-native";
import {
  HAPTIC_EVENTS,
  type HapticEvent,
  type HapticFeel,
} from "./hapticEvents";
import { IDLE_QUEUE, offerHaptic, playDue } from "./hapticQueue";

const IOS_FEEL: Record<HapticFeel, () => Promise<void>> = {
  selection: () => selectionAsync(),
  impactSoft: () => impactAsync(ImpactFeedbackStyle.Soft),
  impactLight: () => impactAsync(ImpactFeedbackStyle.Light),
  impactMedium: () => impactAsync(ImpactFeedbackStyle.Medium),
  success: () => notificationAsync(NotificationFeedbackType.Success),
  warning: () => notificationAsync(NotificationFeedbackType.Warning),
  error: () => notificationAsync(NotificationFeedbackType.Error),
};

const ANDROID_FEEL: Record<HapticFeel, AndroidHaptics> = {
  selection: AndroidHaptics.Clock_Tick,
  impactSoft: AndroidHaptics.Clock_Tick,
  impactLight: AndroidHaptics.Context_Click,
  impactMedium: AndroidHaptics.Long_Press,
  success: AndroidHaptics.Confirm,
  warning: AndroidHaptics.Reject,
  error: AndroidHaptics.Reject,
};

function play(feel: HapticFeel): Promise<void> {
  if (Platform.OS === "android") {
    return performAndroidHapticsAsync(ANDROID_FEEL[feel]);
  }
  return IOS_FEEL[feel]();
}

let queue = IDLE_QUEUE;
let timer: ReturnType<typeof setTimeout> | null = null;

function schedule(): void {
  if (timer || !queue.pending) return;
  const delay = Math.max(0, queue.playAt - performance.now());
  timer = setTimeout(flush, delay);
}

function flush(): void {
  timer = null;
  const due = playDue(queue, performance.now());
  queue = due.queue;
  if (due.play) void play(HAPTIC_EVENTS[due.play]).catch(() => undefined);
  schedule();
}

AppState.addEventListener("change", (appState) => {
  if (appState === "active") return;
  if (timer) clearTimeout(timer);
  timer = null;
  queue = { ...queue, pending: null };
});

export function haptic(event: HapticEvent): void {
  if (AppState.currentState !== "active") return;
  queue = offerHaptic(queue, event, performance.now());
  schedule();
}
