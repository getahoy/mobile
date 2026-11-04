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

export const STACK_GAP_MS = 150;

export function createStackGate(): (now: number) => boolean {
  let lastFiredAt: number | null = null;
  return (now) => {
    if (lastFiredAt !== null && now - lastFiredAt < STACK_GAP_MS) return false;
    lastFiredAt = now;
    return true;
  };
}
