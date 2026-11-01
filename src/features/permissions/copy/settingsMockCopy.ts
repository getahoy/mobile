import type { PermissionKind } from "../permissionKind";
import { permissionCopy } from "./permissionCopy";

const names: Record<PermissionKind, string> = {
  camera: permissionCopy.kind("camera").name,
  mic: permissionCopy.kind("mic").name,
  net: permissionCopy.kind("net").name,
};

const otherAllowed: Record<PermissionKind, { allowed: string; other: string }> =
  {
    camera: { allowed: "Nearby devices", other: "Notifications" },
    mic: { allowed: "Camera, nearby devices", other: "Camera" },
    net: { allowed: "", other: "" },
  };

export const settingsMockCopy = {
  iosSteps: (kind: PermissionKind) => [
    "Tap Open Settings",
    `Turn on ${names[kind]}`,
    "Come back here",
  ],
  androidSteps: (kind: PermissionKind) => [
    "Tap Open Settings",
    `Tap Permissions, then ${names[kind]}`,
    "Choose Allow only while using the app",
    "Come back here",
  ],
  iosAlt: (kind: PermissionKind) =>
    `In Settings, under Ahoy, turn on ${names[kind]}.`,
  androidAlt: (kind: PermissionKind) =>
    `In App info, tap Permissions, then ${names[kind]}, then Allow only while using the app.`,
  iosBack: "Settings",
  appName: "Ahoy",
  iosSection: "Allow Ahoy to access",
  androidAppInfo: "App info",
  androidAppLetter: "a",
  androidVersion: "Version 1.0",
  androidNotifications: "Notifications",
  androidOn: "On",
  androidPermissions: "Permissions",
  androidStorage: "Storage & cache",
  androidStorageUsed: "48 MB used",
  androidAppPermissions: "App permissions",
  androidAllowed: "Allowed",
  androidNearby: "Nearby devices",
  androidNotAllowed: "Not allowed",
  androidAllowedSummary: (kind: PermissionKind) => otherAllowed[kind].allowed,
  androidOtherAllowed: (kind: PermissionKind) => otherAllowed[kind].other,
  androidTarget: (kind: PermissionKind) => names[kind],
  androidPermissionTitle: (kind: PermissionKind) => `${names[kind]} permission`,
  androidChoices: [
    "Allow only while using the app",
    "Ask every time",
    "Don’t allow",
  ],
};
