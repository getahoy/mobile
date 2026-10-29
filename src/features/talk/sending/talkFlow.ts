import type { SpeakTarget } from "@getahoy/protocol";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import type { MacSession } from "@/features/pairing/connection/macSession";
import { transcribeRecording } from "../client/transcribeApi";
import {
  deleteRecording,
  type FileRecorder,
} from "../recorder/useFileRecorder";
import {
  MAX_RECORDING_MS,
  MIN_HOLD_MS,
  RETRYABLE_FAILURES,
  shownFor,
  type TalkState,
} from "../talkState";
import { askMac, choiceRequest, commandRequest } from "./askMac";
import type { MacRequest } from "./sendCommand";
import { uploadFailure } from "./uploadFailure";

export type TalkRecorder = Pick<
  FileRecorder,
  "access" | "requestAccess" | "start" | "stop" | "discard"
>;

type TalkFlowOptions = {
  recorder: () => TalkRecorder;
  session: () => MacSession | null;
  speakOn: () => SpeakTarget;
  onPress: (choosingFor: string | null) => void;
  onState: (state: TalkState) => void;
};

type Retry =
  | { kind: "upload"; uri: string }
  | { kind: "request"; request: MacRequest; heard: string };

type Phase = "idle" | "starting" | "listening" | "working";

const READY: TalkState = { kind: "ready" };
const TOO_SHORT: TalkState = { kind: "tooShort" };

function haptic(): void {
  void impactAsync(ImpactFeedbackStyle.Medium).catch(() => undefined);
}

export class TalkFlow {
  readonly #options: TalkFlowOptions;
  #phase: Phase = "idle";
  #releasedEarly = false;
  #sawRecording = false;
  #pressedAt = 0;
  #attempt = 0;
  #retry: Retry | null = null;
  #choosingFor: string | null = null;
  #maxTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(options: TalkFlowOptions) {
    this.#options = options;
  }

  readonly press = async (): Promise<void> => {
    if (this.#phase !== "idle" || !this.#options.session()) return;
    this.#phase = "starting";
    this.#releasedEarly = false;
    this.#sawRecording = false;
    this.#pressedAt = Date.now();
    this.#forgetRetry();
    this.#attempt += 1;
    this.#options.onPress(this.#choosingFor);
    const attempt = this.#attempt;
    const recorder = this.#options.recorder();
    const allowed =
      recorder.access === "granted" || (await recorder.requestAccess());
    if (attempt !== this.#attempt) return;
    if (!allowed || this.#releasedEarly) return this.#settle(READY);
    const started = await recorder.start().then(
      () => true,
      () => false,
    );
    if (attempt !== this.#attempt) return this.#stopOrphan();
    if (!started) return this.#settle(READY);
    if (this.#releasedEarly) return this.#discard(TOO_SHORT);
    this.#phase = "listening";
    haptic();
    this.#options.onState({ kind: "listening" });
    this.#maxTimer = setTimeout(() => void this.#finish(), MAX_RECORDING_MS);
  };

  readonly release = (): void => {
    if (this.#phase === "starting") this.#releasedEarly = true;
    if (this.#phase !== "listening") return;
    const held = Date.now() - this.#pressedAt;
    void (held < MIN_HOLD_MS ? this.#discard(TOO_SHORT) : this.#finish());
  };

  readonly tryAgain = (): void => {
    const again = this.#retry;
    if (!again || this.#phase !== "idle") return;
    this.#phase = "working";
    if (again.kind === "upload") void this.#upload(again.uri);
    else void this.#ask(again.request, again.heard);
  };

  readonly choose = (number: number): void => {
    const parentId = this.#choosingFor;
    if (!parentId || this.#phase !== "idle") return;
    this.#choosingFor = null;
    this.#phase = "working";
    void this.#ask(choiceRequest(parentId, number), String(number));
  };

  readonly dismissChoices = (): void => {
    if (!this.#choosingFor || this.#phase !== "idle") return;
    this.#choosingFor = null;
    this.#settle(READY);
  };

  interrupt(): void {
    if (this.#phase === "starting" || this.#phase === "listening") {
      void this.#discard(READY);
    }
  }

  recordingChanged(isRecording: boolean): void {
    if (this.#phase !== "listening") return;
    if (isRecording) this.#sawRecording = true;
    else if (this.#sawRecording) void this.#discard(READY);
  }

  async #finish(): Promise<void> {
    if (this.#phase !== "listening") return;
    this.#phase = "working";
    this.#clearMaxTimer();
    const recorder = this.#options.recorder();
    const uri = await recorder.stop().catch(() => null);
    haptic();
    if (!uri) return this.#settle(READY);
    await this.#upload(uri);
  }

  async #upload(uri: string): Promise<void> {
    this.#retry = { kind: "upload", uri };
    this.#options.onState({ kind: "understanding" });
    const result = await transcribeRecording(uri);
    if (result.code === "success") {
      deleteRecording(uri);
      const { text } = result.data;
      return this.#ask(commandRequest(text, this.#options.speakOn()), text);
    }
    const failure = await uploadFailure(result.error);
    if (!RETRYABLE_FAILURES.includes(failure)) this.#forgetRetry();
    this.#settle({ kind: "failed", failure, heard: null });
  }

  async #ask(request: MacRequest, heard: string): Promise<void> {
    this.#retry = { kind: "request", request, heard };
    const { session, onState } = this.#options;
    const state = await askMac(session(), request, heard, onState);
    const answered = state.kind === "answered";
    if (answered) this.#retry = null;
    const choosing = answered && state.choices.length > 0;
    this.#choosingFor = choosing ? request.commandId : null;
    this.#settle(state);
  }

  async #discard(next: TalkState): Promise<void> {
    this.#clearMaxTimer();
    this.#settle(next);
    await this.#stopOrphan();
  }

  async #stopOrphan(): Promise<void> {
    const recorder = this.#options.recorder();
    await recorder.discard().catch(() => undefined);
  }

  #forgetRetry(): void {
    if (this.#retry?.kind === "upload") deleteRecording(this.#retry.uri);
    this.#retry = null;
  }

  #clearMaxTimer(): void {
    if (this.#maxTimer) clearTimeout(this.#maxTimer);
    this.#maxTimer = null;
  }

  #settle(state: TalkState): void {
    this.#phase = "idle";
    this.#attempt += 1;
    this.#options.onState(state);
    const attempt = this.#attempt;
    const shownMs = shownFor(state);
    if (shownMs === null) return;
    setTimeout(() => {
      if (attempt !== this.#attempt) return;
      this.#choosingFor = null;
      this.#options.onState(READY);
    }, shownMs);
  }
}
