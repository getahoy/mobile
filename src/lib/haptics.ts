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
  createStackGate,
  HAPTIC_EVENTS,
  type HapticEvent,
  type HapticFeel,
} from "./hapticEvents";

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

const stackGate = createStackGate();

export function haptic(event: HapticEvent): void {
  if (AppState.currentState !== "active") return;
  if (!stackGate(performance.now())) return;
  void play(HAPTIC_EVENTS[event]).catch(() => undefined);
}
