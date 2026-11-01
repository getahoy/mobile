import { Platform } from "react-native";
import type { SettingsLook } from "../guideTimeline";

const onIos = Platform.OS === "ios";
const settingsLook: SettingsLook = onIos ? "ios" : "android";

export const permissionPlatform = {
  settingsLook,
  asksForLocalNetwork: onIos,
};
