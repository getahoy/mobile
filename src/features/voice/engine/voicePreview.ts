import { SPEAK_VOICES, type SpeakVoice } from "@getahoy/protocol";
import {
  IDLE,
  type PreviewEvent,
  type PreviewState,
  previewStep,
} from "../previewState";
import { preparePlayback } from "./audioPlayback";
import {
  choosePlayable,
  locatePreview,
  type Playable,
  SpeechFetches,
} from "./previewAudio";
import { PreviewPlayer } from "./previewPlayer";

const PLAYS_IN_SILENT_MODE = true;

export class VoicePreview {
  #state: PreviewState = IDLE;
  #pending: AbortController | null = null;
  readonly #fetches = new SpeechFetches();
  readonly #player = new PreviewPlayer(() => this.#send({ type: "stop" }));
  readonly #text: string;
  readonly #onChange: (state: PreviewState) => void;

  constructor(text: string, onChange: (state: PreviewState) => void) {
    this.#text = text;
    this.#onChange = onChange;
  }

  toggle(voice: SpeakVoice): void {
    const next = this.#send({ type: "tap", voice });
    switch (next.kind) {
      case "loading":
        this.#halt();
        void this.#start(voice);
        break;
      case "paused":
        this.#player.pause();
        break;
      case "playing":
        this.#player.resume();
        break;
      case "idle":
        this.#halt();
        break;
      default: {
        const unhandled: never = next;
        throw new Error(`Unhandled preview state ${JSON.stringify(unhandled)}`);
      }
    }
  }

  stop(): void {
    this.#halt();
    this.#send({ type: "stop" });
  }

  warm(): void {
    for (const voice of SPEAK_VOICES) {
      void locatePreview(this.#text, voice)
        .then(({ key, source }) => {
          if (source.kind !== "fetch") return;
          this.#fetches.warm(key, this.#text, voice);
        })
        .catch(() => undefined);
    }
  }

  async #start(voice: SpeakVoice): Promise<void> {
    const abort = new AbortController();
    this.#pending = abort;
    const playable = await choosePlayable(
      this.#text,
      voice,
      this.#fetches,
    ).catch((): Playable => ({ kind: "device" }));
    await preparePlayback(PLAYS_IN_SILENT_MODE).catch(() => undefined);
    if (abort.signal.aborted) return;
    if (playable.kind === "audio") this.#player.playAudio(playable.source);
    else this.#player.playDevice(this.#text, voice);
    this.#send({ type: "ready", voice });
  }

  #halt(): void {
    this.#pending?.abort();
    this.#pending = null;
    this.#player.stop();
  }

  #send(event: PreviewEvent): PreviewState {
    this.#state = previewStep(this.#state, event);
    this.#onChange(this.#state);
    return this.#state;
  }
}
