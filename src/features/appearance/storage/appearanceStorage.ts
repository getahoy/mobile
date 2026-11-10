import { createMMKV } from "react-native-mmkv";
import { z } from "zod";
import { APPEARANCES, type Appearance } from "../appearanceChoice";

const APPEARANCE_KEY = "appearance.choice";

const appearanceStorage = createMMKV({ id: "ahoy.appearance" });

const appearanceSchema = z.enum(APPEARANCES).catch("system");

export function readAppearance(): Appearance {
  return appearanceSchema.parse(appearanceStorage.getString(APPEARANCE_KEY));
}

export function writeAppearance(appearance: Appearance): void {
  appearanceStorage.set(APPEARANCE_KEY, appearance);
}
