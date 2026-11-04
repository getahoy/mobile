import type { SpeakVoice } from "@getahoy/protocol";
import {
  type AudioPlayer,
  type AudioSource,
  createAudioPlayer,
} from "expo-audio";
import { fadeOut } from "./audioPlayback";
import { deviceVoice } from "./deviceVoice";

type Current =
  | { kind: "audio"; player: AudioPlayer; release: () => void }
  | { kind: "device"; abort: AbortController };

export class PreviewPlayer {
  #current: Current | null = null;
  readonly #onEnded: () => void;

  constructor(onEnded: () => void) {
    this.#onEnded = onEnded;
  }

  playAudio(source: AudioSource): void {
    this.stop();
    const player = createAudioPlayer(source);
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (status.didJustFinish) this.#finish();
      },
    );
    const release = () => {
      subscription.remove();
      void fadeOut(player).then(() => player.remove());
    };
    this.#current = { kind: "audio", player, release };
    player.play();
  }

  playDevice(text: string, voice: SpeakVoice): void {
    this.stop();
    const abort = new AbortController();
    this.#current = { kind: "device", abort };
    void deviceVoice.speak(text, { voice, signal: abort.signal }).then(() => {
      if (!abort.signal.aborted) this.#finish();
    });
  }

  pause(): void {
    if (this.#current?.kind === "audio") this.#current.player.pause();
    else if (this.#current?.kind === "device") this.#finish();
  }

  resume(): void {
    if (this.#current?.kind === "audio") this.#current.player.play();
  }

  stop(): void {
    const current = this.#current;
    this.#current = null;
    if (current?.kind === "audio") current.release();
    if (current?.kind === "device") current.abort.abort();
  }

  #finish(): void {
    this.stop();
    this.#onEnded();
  }
}
