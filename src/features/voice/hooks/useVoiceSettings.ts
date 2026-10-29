import { useState } from "react";
import {
  readVoiceSettings,
  type VoiceSettings,
  writeVoiceSettings,
} from "../storage/voiceSettings";

export function useVoiceSettings() {
  const [settings, setSettings] = useState(readVoiceSettings);
  const change = (update: Partial<VoiceSettings>) => {
    setSettings(writeVoiceSettings(update));
  };
  return { settings, change };
}
