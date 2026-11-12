import type { SpeakTarget } from "@getahoy/protocol";
import type { MacSession } from "@/features/pairing/connection/macSession";
import type { FileRecorder, MicRefusal } from "../recorder/useFileRecorder";
import type { TalkState } from "../talkState";
import type { AppActivity } from "./appActivity";
import type { MacRequest } from "./sendCommand";
import type { SessionLink } from "./waitForSession";

type TalkRecorder = Pick<FileRecorder, "start" | "stop" | "discard">;

export type TalkFlowOptions = {
  recorder: () => TalkRecorder;
  onMicRefused: (refusal: MicRefusal) => void;
  canTalk: () => boolean;
  link: SessionLink<MacSession>;
  activity: AppActivity;
  speakOn: () => SpeakTarget;
  onPress: (choosingFor: string | null) => void;
  onState: (state: TalkState) => void;
};

export type Retry =
  | { kind: "upload"; uri: string }
  | { kind: "request"; request: MacRequest; heard: string };

export type Phase = "idle" | "starting" | "listening" | "working";

export type FinishReason = "released" | "limitReached";
