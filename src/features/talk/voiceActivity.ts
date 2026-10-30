import type { OrbMotion } from "@/components/ui/orb";
import type { TalkState } from "./talkState";

export type DotsMode = "off" | "level" | "pulse";

export type VoiceActivity = {
  dots: DotsMode;
  tone: "listen" | "speak";
  orb: OrbMotion | null;
  level: number;
};

type Speech = { speaking: boolean; level: number | null };

const BUSY: readonly TalkState["kind"][] = ["understanding", "sending"];

export function voiceActivity(
  state: TalkState,
  speech: Speech,
  micLevel: number,
): VoiceActivity {
  if (state.kind === "listening") {
    return { dots: "level", tone: "listen", orb: "level", level: micLevel };
  }
  if (BUSY.includes(state.kind)) {
    return { dots: "off", tone: "listen", orb: "breathe", level: 0 };
  }
  if (!speech.speaking) {
    return { dots: "off", tone: "listen", orb: null, level: 0 };
  }
  if (speech.level === null) {
    return { dots: "pulse", tone: "speak", orb: "breathe", level: 0 };
  }
  return { dots: "level", tone: "speak", orb: "level", level: speech.level };
}
