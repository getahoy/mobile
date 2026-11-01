import { createMMKV } from "react-native-mmkv";
import { z } from "zod";

const SETTINGS_RETURN_KEY = "permissions.settingsReturn";

const permissionStorage = createMMKV({ id: "ahoy.permissions" });

const settingsReturnSchema = z.enum(["resumePairing", "resumeTalk"]);

export type SettingsReturn = z.infer<typeof settingsReturnSchema>;

export function rememberSettingsReturn(to: SettingsReturn): void {
  permissionStorage.set(SETTINGS_RETURN_KEY, to);
}

export function forgetSettingsReturn(): void {
  permissionStorage.remove(SETTINGS_RETURN_KEY);
}

export function takeSettingsReturn(): SettingsReturn | null {
  const stored = permissionStorage.getString(SETTINGS_RETURN_KEY);
  forgetSettingsReturn();
  const parsed = settingsReturnSchema.safeParse(stored);
  return parsed.success ? parsed.data : null;
}
