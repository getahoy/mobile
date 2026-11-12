import { VOICE_PREVIEW_LINE } from "@getahoy/protocol";
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
  playsOnHelp: {
    phone: "Best when you’re away from your Mac",
    mac: "Your Mac speaks, your phone stays quiet",
    both:
      Platform.OS === "ios"
        ? "Your Mac and this iPhone both speak"
        : "Your Mac and this phone both speak",
    off: "Text only",
  },
  policyHelp: {
    problems: "When Ahoy needs a choice or something failed",
    everything: "Every result, including Done",
    off: "Text only, with soft sounds",
  },
  voiceHelp: {
    default: "A natural English voice",
    india: "English with an Indian accent",
  },
  previewLine: VOICE_PREVIEW_LINE,
  playSample: "Play sample",
  pauseSample: "Pause",
  playSampleLabel: (voice: string) => `Play a sample of the ${voice} voice`,
  pauseSampleLabel: (voice: string) => `Pause the ${voice} sample`,
  footer:
    "Ahoy talks back when it needs you. Successes get a soft sound instead.",
  silentMode: "Speak in silent mode",
} as const;
