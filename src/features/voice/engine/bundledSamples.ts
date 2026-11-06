import { SPEAK_VOICES, type SpeakVoice } from "@getahoy/protocol";
import type { AudioSource } from "expo-audio";
import { z } from "zod";
import type { BundledSample } from "../previewSource";
import { PROMPT_CLIPS } from "../promptClips";

const CLIPS = ["sample", ...PROMPT_CLIPS] as const;

type Clip = (typeof CLIPS)[number];

const CLIP_AUDIO: Record<SpeakVoice, Record<Clip, AudioSource>> = {
  default: {
    sample: require("../../../../assets/voice-samples/default.mp3"),
    whichOne: require("../../../../assets/voice-samples/default-whichOne.mp3"),
    confirm: require("../../../../assets/voice-samples/default-confirm.mp3"),
  },
  india: {
    sample: require("../../../../assets/voice-samples/india.mp3"),
    whichOne: require("../../../../assets/voice-samples/india-whichOne.mp3"),
    confirm: require("../../../../assets/voice-samples/india-confirm.mp3"),
  },
};

const manifestSchema = z.array(
  z.object({
    voice: z.enum(SPEAK_VOICES),
    clip: z.enum(CLIPS).default("sample"),
    voiceId: z.string(),
    text: z.string(),
  }),
);

const shippedManifest: unknown = require("../../../../assets/voice-samples/manifest.json");
const parsedManifest = manifestSchema.safeParse(shippedManifest);
const SAMPLES = parsedManifest.success ? parsedManifest.data : [];

const sampleFor = (voice: SpeakVoice, text: string) =>
  SAMPLES.find((sample) => sample.voice === voice && sample.text === text);

export function bundledSample(
  voice: SpeakVoice,
  text: string,
): BundledSample | null {
  return sampleFor(voice, text) ?? null;
}

export function bundledAudio(voice: SpeakVoice, text: string) {
  const sample = sampleFor(voice, text);
  return sample ? CLIP_AUDIO[voice][sample.clip] : null;
}
