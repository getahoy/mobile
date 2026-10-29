import {
  type AudioPlayer,
  type AudioSource,
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";

const FADE_MS = 80;
const FADE_STEPS = 4;

export type Played = "finished" | "stopped";

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
): Promise<Played> {
  const player = createAudioPlayer(source);
  return new Promise((resolve) => {
    const finish = (played: Played) => {
      subscription.remove();
      signal.removeEventListener("abort", stop);
      player.remove();
      resolve(played);
    };
    const stop = () => void fadeOut(player).then(() => finish("stopped"));
    const onStatus = (status: { didJustFinish: boolean }) => {
      if (status.didJustFinish) finish("finished");
    };
    const subscription = player.addListener("playbackStatusUpdate", onStatus);
    if (signal.aborted) return finish("stopped");
    signal.addEventListener("abort", stop);
    player.play();
  });
}
