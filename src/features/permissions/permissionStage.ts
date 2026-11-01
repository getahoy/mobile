export type PermissionStage = "granted" | "explainer" | "again" | "guide";

export type PermissionReading = {
  granted: boolean;
  asked: boolean;
  canAskAgain: boolean;
};

export function permissionStage(reading: PermissionReading): PermissionStage {
  if (reading.granted) return "granted";
  if (!reading.asked) return "explainer";
  return reading.canAskAgain ? "again" : "guide";
}
