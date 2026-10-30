import {
  type AudioPlayer,
  type AudioSource,
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";

import { sampleLevel } from "./sampleLevel";

const FADE_MS = 80;
const FADE_STEPS = 4;
const LEVEL_INTERVAL_MS = 80;

// iOS reads playsInSilentMode; Android has no silent switch and ignores it.
export async function preparePlayback(playsInSilentMode: boolean) {
  await setAudioModeAsync({
    allowsRecording: false,
    playsInSilentMode,
    interruptionMode: "duckOthers",
  });
}

async function fadeOut(player: AudioPlayer): Promise<void> {
  const start = player.volume;
  for (let step = FADE_STEPS - 1; step >= 0; step -= 1) {
    player.volume = (start * step) / FADE_STEPS;
    await new Promise((resolve) => setTimeout(resolve, FADE_MS / FADE_STEPS));
  }
  player.pause();
}

// Android samples only with the microphone permission; without it the reply still plays, just without levels.
function reportLevels(player: AudioPlayer, onLevel: (level: number) => void) {
  let last = 0;
  try {
    player.setAudioSamplingEnabled(true);
  } catch {
    return null;
  }
  return player.addListener("audioSampleUpdate", (sample) => {
    const now = Date.now();
    if (now - last < LEVEL_INTERVAL_MS) return;
    last = now;
    onLevel(sampleLevel(sample.channels[0]?.frames ?? []));
  });
}

export function playSource(
  source: AudioSource,
  signal: AbortSignal,
  onLevel?: (level: number) => void,
): Promise<void> {
  const player = createAudioPlayer(source);
  const levels = onLevel ? reportLevels(player, onLevel) : null;
  return new Promise((resolve) => {
    let finished = false;
    // The clip can end during the stop fade, and a removed player must not be removed twice.
    const finish = () => {
      if (finished) return;
      finished = true;
      subscription.remove();
      levels?.remove();
      signal.removeEventListener("abort", stop);
      player.remove();
      resolve();
    };
    const stop = () => void fadeOut(player).then(finish);
    const onStatus = (status: { didJustFinish: boolean }) => {
      if (status.didJustFinish) finish();
    };
    const subscription = player.addListener("playbackStatusUpdate", onStatus);
    if (signal.aborted) return finish();
    signal.addEventListener("abort", stop);
    player.play();
  });
}
