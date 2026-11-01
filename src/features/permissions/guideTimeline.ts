import type { PermissionKind } from "./permissionKind";

export type SettingsLook = "ios" | "android";

export type FingerPoint = {
  x: number;
  y: number;
  visible: boolean;
  pressed: boolean;
};

export type IosFrame = {
  finger: FingerPoint;
  targetRow: number;
  targetOn: boolean;
  activeStep: number;
};

export type AndroidScreen = "appInfo" | "permissions" | "choice";

export type AndroidFrame = {
  finger: FingerPoint;
  screen: AndroidScreen;
  permissionsPressed: boolean;
  targetPressed: boolean;
  firstChoicePressed: boolean;
  picked: boolean;
  activeStep: number;
};

type Frames<T> = readonly [T, ...T[]];

const FRAME_MS: Record<SettingsLook, Frames<number>> = {
  ios: [500, 800, 450, 1700],
  android: [900, 450, 900, 450, 900, 500, 1700],
};

const IOS_STEPS: Frames<number> = [1, 1, 1, 2];
const ANDROID_STEPS: Frames<number> = [1, 1, 1, 1, 2, 2, 3];
const IOS_TOGGLE_ON_FROM = 2;

const IOS_ROW: Record<PermissionKind, number> = { net: 0, camera: 1, mic: 2 };
const IOS_FIRST_ROW_TOP = 96;
const IOS_ROW_HEIGHT = 40;
const IOS_TOGGLE_FROM_RIGHT = 44;
const IOS_FINGER_START = { x: 100, y: 250 };

const ANDROID_PERMISSIONS_ROW = { x: 150, y: 159 };
const ANDROID_TARGET_ROW = { x: 150, y: 189 };
const ANDROID_FIRST_CHOICE = { x: 170, y: 86 };

function pick<T>(frames: Frames<T>, frame: number): T {
  return frames[frame % frames.length] ?? frames[0];
}

type Pose = "rest" | "press" | "away";

function touch(point: { x: number; y: number }, pose: Pose): FingerPoint {
  return { ...point, visible: pose !== "away", pressed: pose === "press" };
}

export function frameCount(look: SettingsLook): number {
  return FRAME_MS[look].length;
}

export function frameDuration(look: SettingsLook, frame: number): number {
  return pick(FRAME_MS[look], frame);
}

export function iosFrame(kind: PermissionKind, frame: number): IosFrame {
  const targetRow = IOS_ROW[kind];
  const toggle = {
    x: IOS_TOGGLE_FROM_RIGHT,
    y: IOS_FIRST_ROW_TOP + IOS_ROW_HEIGHT * targetRow + IOS_ROW_HEIGHT / 2,
  };
  const fingers: Frames<FingerPoint> = [
    touch(IOS_FINGER_START, "away"),
    touch(toggle, "rest"),
    touch(toggle, "press"),
    touch(toggle, "away"),
  ];
  const step = frame % frameCount("ios");
  return {
    finger: pick(fingers, step),
    targetRow,
    targetOn: step >= IOS_TOGGLE_ON_FROM,
    activeStep: pick(IOS_STEPS, step),
  };
}

function androidScreen(step: number): AndroidScreen {
  if (step <= 1) return "appInfo";
  return step <= 3 ? "permissions" : "choice";
}

export function androidFrame(frame: number): AndroidFrame {
  const fingers: Frames<FingerPoint> = [
    touch(ANDROID_PERMISSIONS_ROW, "rest"),
    touch(ANDROID_PERMISSIONS_ROW, "press"),
    touch(ANDROID_TARGET_ROW, "rest"),
    touch(ANDROID_TARGET_ROW, "press"),
    touch(ANDROID_FIRST_CHOICE, "rest"),
    touch(ANDROID_FIRST_CHOICE, "press"),
    touch(ANDROID_FIRST_CHOICE, "away"),
  ];
  const step = frame % frameCount("android");
  return {
    finger: pick(fingers, step),
    screen: androidScreen(step),
    permissionsPressed: step === 1,
    targetPressed: step === 3,
    firstChoicePressed: step === 5,
    picked: step >= 5,
    activeStep: pick(ANDROID_STEPS, step),
  };
}
