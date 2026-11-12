import { type Appearance, appearanceSchema } from "@getahoy/lib";
import { createMMKV } from "react-native-mmkv";

const APPEARANCE_KEY = "appearance.choice";

const appearanceStorage = createMMKV({ id: "ahoy.appearance" });

const storedAppearanceSchema = appearanceSchema.catch("system");

export function readAppearance(): Appearance {
  const stored = appearanceStorage.getString(APPEARANCE_KEY);
  return storedAppearanceSchema.parse(stored);
}

export function writeAppearance(appearance: Appearance): void {
  appearanceStorage.set(APPEARANCE_KEY, appearance);
}
