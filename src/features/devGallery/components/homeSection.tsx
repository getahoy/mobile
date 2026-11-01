import { View } from "react-native";
import { MacChip } from "@/features/pairing/components/macChip";
import { MacMessageCard } from "@/features/pairing/components/macMessageCard";
import type { MacLinkState } from "@/features/pairing/connection/macLinkState";
import { macCopy } from "@/features/pairing/copy/macCopy";
import type { MacCardAction } from "@/features/pairing/hooks/useMacCardActions";
import { macStatus } from "@/features/pairing/macStatus";
import { HeardLine } from "@/features/talk/components/heardLine";
import { ReplyCard } from "@/features/talk/components/replyCard";
import { TalkBar } from "@/features/talk/components/talkBar";
import { TryHints } from "@/features/talk/components/tryHints";
import { talkCopy } from "@/features/talk/copy/talkCopy";
import type { TalkState } from "@/features/talk/talkState";
import { voiceActivity } from "@/features/talk/voiceActivity";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";

const MAC = galleryCopy.macName;
const SAMPLE_LISTENING_MS = 4000;
const noop = () => undefined;

const states: readonly (readonly [string, MacLinkState])[] = [
  ["connected", { kind: "connected", locked: false }],
  ["connecting", { kind: "connecting" }],
  ["locked", { kind: "connected", locked: true }],
  ["paused", { kind: "paused" }],
  ["off", { kind: "macOff" }],
  ["quit", { kind: "macQuit" }],
  ["asleep", { kind: "macAsleep" }],
  ["wifi", { kind: "unreachable", onCellular: false }],
  ["cellular", { kind: "unreachable", onCellular: true }],
  ["tooOld", { kind: "macTooOld" }],
  ["tooNew", { kind: "macTooNew" }],
  ["unrecognised", { kind: "unrecognised" }],
];

function action(label: string, tone: MacCardAction["tone"]): MacCardAction {
  return { label, tone, onPress: noop };
}

function sampleActions(state: MacLinkState): MacCardAction[] {
  if (state.kind === "paused") return [action(macCopy.connect, "primary")];
  if (state.kind === "unrecognised") {
    return [action(macCopy.pairAgain, "outline")];
  }
  if (state.kind === "unreachable" && !state.onCellular) {
    return [action(macCopy.retry, "outline")];
  }
  return [];
}

const SAMPLE_DURATION_MS = 800;

const done = {
  label: talkCopy.doneIn(SAMPLE_DURATION_MS),
  tone: "done",
  message: galleryCopy.body,
  followUp: talkCopy.followUp(galleryCopy.sheetTitle, "2"),
  retry: false,
} as const;

const failed = {
  label: talkCopy.statusLabel("failed"),
  tone: "failed",
  message: talkCopy.noAnswer(MAC),
  followUp: null,
  retry: true,
} as const;

const bar = {
  macName: MAC,
  onStart: noop,
  onStop: noop,
  onInterrupted: noop,
} as const;

const SAMPLE_LEVEL = 0.5;
const silent = { speaking: false, level: null };
const ready: TalkState = { kind: "ready" };

const barSamples: readonly {
  id: string;
  label: string;
  labelStyle: "text" | "timer";
  disabled: boolean;
  state: TalkState;
  speech: { speaking: boolean; level: number | null };
}[] = [
  {
    id: "idle",
    label: talkCopy.holdToTalk,
    labelStyle: "text",
    disabled: false,
    state: ready,
    speech: silent,
  },
  {
    id: "listening",
    label: talkCopy.listening(SAMPLE_LISTENING_MS),
    labelStyle: "timer",
    disabled: false,
    state: { kind: "listening" },
    speech: silent,
  },
  {
    id: "understanding",
    label: talkCopy.understanding,
    labelStyle: "text",
    disabled: false,
    state: { kind: "understanding" },
    speech: silent,
  },
  {
    id: "speaking",
    label: talkCopy.holdToTalk,
    labelStyle: "text",
    disabled: false,
    state: ready,
    speech: { speaking: true, level: SAMPLE_LEVEL },
  },
  {
    id: "speakingPulse",
    label: talkCopy.holdToTalk,
    labelStyle: "text",
    disabled: false,
    state: ready,
    speech: { speaking: true, level: null },
  },
  {
    id: "disabled",
    label: talkCopy.holdToTalk,
    labelStyle: "text",
    disabled: true,
    state: ready,
    speech: silent,
  },
];

export function HomeSection() {
  return (
    <GallerySection title={galleryCopy.home}>
      {states.map(([id, state]) => {
        const status = macStatus(state, MAC);
        return (
          <View key={id} className="gap-2">
            <MacChip name={MAC} status={status} onPress={noop} />
            {status.message ? (
              <MacMessageCard
                message={status.message}
                actions={sampleActions(state)}
                help={null}
              />
            ) : null}
          </View>
        );
      })}
      <HeardLine text={galleryCopy.heardSample} />
      <ReplyCard reply={done} onRetry={noop} />
      <ReplyCard reply={failed} onRetry={noop} />
      <TryHints />
      {barSamples.map((sample) => (
        <TalkBar
          key={sample.id}
          {...bar}
          label={sample.label}
          labelStyle={sample.labelStyle}
          disabled={sample.disabled}
          activity={voiceActivity(sample.state, sample.speech, SAMPLE_LEVEL)}
        />
      ))}
    </GallerySection>
  );
}
