import { SPEAK_VOICES, type SpeakVoice } from "@getahoy/protocol";
import type { AudioSource } from "expo-audio";
import { z } from "zod";
import type { BundledSample } from "../previewSource";

const SAMPLE_AUDIO: Record<SpeakVoice, AudioSource> = {
  default: require("../../../../assets/voice-samples/default.mp3"),
  india: require("../../../../assets/voice-samples/india.mp3"),
};

const manifestSchema = z.array(
  z.object({
    voice: z.enum(SPEAK_VOICES),
    voiceId: z.string(),
    text: z.string(),
  }),
);

const shippedManifest: unknown = require("../../../../assets/voice-samples/manifest.json");
const parsedManifest = manifestSchema.safeParse(shippedManifest);
const SAMPLES = parsedManifest.success ? parsedManifest.data : [];

export function bundledSample(voice: SpeakVoice): BundledSample | null {
  return SAMPLES.find((sample) => sample.voice === voice) ?? null;
}

export function bundledAudio(voice: SpeakVoice): AudioSource {
  return SAMPLE_AUDIO[voice];
}
