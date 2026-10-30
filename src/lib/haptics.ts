import {
  ImpactFeedbackStyle,
  impactAsync,
  NotificationFeedbackType,
  notificationAsync,
  selectionAsync,
} from "expo-haptics";

function quietly(feedback: Promise<void>): void {
  void feedback.catch(() => undefined);
}

export const haptics = {
  talkStart: () => quietly(impactAsync(ImpactFeedbackStyle.Medium)),
  talkEnd: () => quietly(impactAsync(ImpactFeedbackStyle.Light)),
  choicePicked: () => quietly(selectionAsync()),
  confirmOpen: () =>
    quietly(notificationAsync(NotificationFeedbackType.Warning)),
  success: () => quietly(notificationAsync(NotificationFeedbackType.Success)),
};
