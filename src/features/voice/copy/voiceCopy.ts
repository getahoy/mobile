import { Platform } from "react-native";

export const voiceCopy = {
  title: "Voice replies",
  playsOn: "Play replies on",
  playsOnOptions: {
    phone: Platform.OS === "ios" ? "This iPhone" : "This phone",
    mac: "Mac",
    both: "Both",
    off: "Off",
  },
  policy: "Speak",
  policyOptions: {
    problems: "Questions and problems",
    everything: "Everything",
    off: "Off",
  },
  voice: "Voice",
  voiceOptions: { default: "Default", india: "Indian English" },
  silentMode: "Speak in silent mode",
  silentModeOptions: { on: "On", off: "Off" },
} as const;
