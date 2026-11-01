import type { DevicePermission, PermissionKind } from "../permissionKind";
import { permissionCopy } from "./permissionCopy";

const nameOf = (kind: PermissionKind) => permissionCopy.kind(kind).name;

const otherAllowed: Record<
  DevicePermission,
  { allowed: string; other: string }
> = {
  camera: { allowed: "Nearby devices", other: "Notifications" },
  mic: { allowed: "Camera, nearby devices", other: "Camera" },
};

export const settingsMockCopy = {
  iosSteps: (kind: PermissionKind) => [
    "Tap Open Settings",
    `Turn on ${nameOf(kind)}`,
    "Come back here",
  ],
  androidSteps: (kind: DevicePermission) => [
    "Tap Open Settings",
    `Tap Permissions, then ${nameOf(kind)}`,
    "Choose Allow only while using the app",
    "Come back here",
  ],
  iosAlt: (kind: PermissionKind) =>
    `In Settings, under Ahoy, turn on ${nameOf(kind)}.`,
  androidAlt: (kind: DevicePermission) =>
    `In App info, tap Permissions, then ${nameOf(kind)}, then Allow only while using the app.`,
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
  androidAllowedSummary: (kind: DevicePermission) => otherAllowed[kind].allowed,
  androidOtherAllowed: (kind: DevicePermission) => otherAllowed[kind].other,
  androidPermissionTitle: (kind: DevicePermission) =>
    `${nameOf(kind)} permission`,
  androidChoices: [
    "Allow only while using the app",
    "Ask every time",
    "Don’t allow",
  ],
};
