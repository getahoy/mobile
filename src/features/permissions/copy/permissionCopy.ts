import type { PermissionKind } from "../permissionKind";
import { systemPrompts } from "./systemPrompts";

type KindCopy = {
  name: string;
  explainerTitle: string;
  explainerBody: string;
  explainerAction: string;
  againTitle: string;
  againBody: string;
  againAction: string;
  guideTitle: string;
  guideBody: string;
  restrictedTitle: string;
  restrictedBody: string;
  busyTitle: string;
  busyBody: string;
};

const managedPhone =
  "Screen Time, or the school or company that manages this phone, has turned it off. Settings can’t change it from here. Ask whoever manages this phone.";

const kinds: Record<PermissionKind, KindCopy> = {
  camera: {
    name: "Camera",
    explainerTitle: "Scan the code on your Mac.",
    explainerBody: systemPrompts.camera,
    explainerAction: "Open camera",
    againTitle: "Ahoy needs the camera to pair.",
    againBody:
      "It only scans the code on your Mac. Nothing is saved or recorded.",
    againAction: "Allow camera",
    guideTitle: "Turn on camera",
    guideBody: "Ahoy only uses it to scan the code on your Mac.",
    restrictedTitle: "Camera is restricted on this phone.",
    restrictedBody: managedPhone,
    busyTitle: "Camera couldn’t start",
    busyBody:
      "Another app may be using it, like FaceTime. Close it, then try again.",
  },
  mic: {
    name: "Microphone",
    explainerTitle: "Talk to your Mac.",
    explainerBody: systemPrompts.mic,
    explainerAction: "Allow microphone",
    againTitle: "Ahoy needs the microphone to hear you.",
    againBody:
      "It listens only while you hold the talk button. Nothing is kept after your command runs.",
    againAction: "Allow microphone",
    guideTitle: "Turn on microphone",
    guideBody: "Ahoy only listens while you hold the talk button.",
    restrictedTitle: "Microphone is restricted on this phone.",
    restrictedBody: managedPhone,
    busyTitle: "Microphone couldn’t start",
    busyBody:
      "Another app may be using it, like a call. End it, then try again.",
  },
  net: {
    name: "Local Network",
    explainerTitle: "Find your Mac on your Wi‑Fi.",
    explainerBody:
      "Ahoy talks to your Mac directly over your Wi‑Fi. Your iPhone will ask once to let Ahoy find it.",
    explainerAction: "Continue",
    againTitle: "Ahoy needs Local Network to reach your Mac.",
    againBody: "It only talks to your own Mac on your Wi‑Fi.",
    againAction: "Continue",
    guideTitle: "Turn on Local Network",
    guideBody: "Ahoy needs it to reach your Mac over your Wi‑Fi.",
    restrictedTitle: "Local Network is restricted on this phone.",
    restrictedBody:
      "The school or company that manages this phone has turned it off. Ask whoever manages this phone.",
    busyTitle: "Can’t reach your Mac",
    busyBody: "Check that both are on the same Wi‑Fi, then try again.",
  },
};

export const permissionCopy = {
  kind: (kind: PermissionKind) => kinds[kind],
  isOn: (kind: PermissionKind) => `${kinds[kind].name} is on`,
  againHintLead: "When Android asks, choose ",
  againHintChoice: "While using the app",
  againHintEnd: ".",
  openSettings: "Open Settings",
  notNow: "Not now",
  tryAgain: "Try again",
  close: "Close",
  checking: "Checking access…",
  checkLocalNetwork: "Still can’t connect? Check Local Network",
};
