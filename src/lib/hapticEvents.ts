export type HapticFeel =
  | "selection"
  | "impactSoft"
  | "impactLight"
  | "impactMedium"
  | "success"
  | "warning"
  | "error";

export const HAPTIC_EVENTS = {
  talkStart: "impactMedium",
  talkStop: "impactLight",
  talkCancel: "warning",
  tooShort: "warning",
  recordingLimit: "warning",
  macAsks: "impactLight",
  commandDone: "impactSoft",
  replyFailed: "error",
  qrDetected: "selection",
  paired: "success",
  pairingEnded: "warning",
  zoomStep: "selection",
  choicePicked: "selection",
  optionSelected: "selection",
  switchToggled: "selection",
  signInFailed: "error",
} as const satisfies Record<string, HapticFeel>;

export type HapticEvent = keyof typeof HAPTIC_EVENTS;
