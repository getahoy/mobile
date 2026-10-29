import {
  type AudioPlayer,
  type AudioSource,
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";

const FADE_MS = 80;
const FADE_STEPS = 4;

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

export function playSource(
  source: AudioSource,
  signal: AbortSignal,
): Promise<void> {
  const player = createAudioPlayer(source);
  return new Promise((resolve) => {
    let finished = false;
    // The clip can end during the stop fade, and a removed player must not be removed twice.
    const finish = () => {
      if (finished) return;
      finished = true;
      subscription.remove();
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
