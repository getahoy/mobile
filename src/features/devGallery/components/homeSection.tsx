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
import { talkCopy } from "@/features/talk/copy/talkCopy";
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
  ["removed", { kind: "ended", reason: "removed" }],
  ["replaced", { kind: "ended", reason: "replaced" }],
  ["signedOut", { kind: "ended", reason: "signed_out" }],
];

function action(label: string, tone: MacCardAction["tone"]): MacCardAction {
  return { label, tone, onPress: noop };
}

function sampleActions(state: MacLinkState): MacCardAction[] {
  if (state.kind === "ended") {
    return [
      action(macCopy.pairAgain, "primary"),
      action(macCopy.dismiss, "outline"),
    ];
  }
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
  level: 0.5,
  onStart: noop,
  onStop: noop,
  onInterrupted: noop,
} as const;

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
              />
            ) : null}
          </View>
        );
      })}
      <HeardLine text={galleryCopy.heardSample} />
      <ReplyCard reply={done} onRetry={noop} />
      <ReplyCard reply={failed} onRetry={noop} />
      <TalkBar
        {...bar}
        label={talkCopy.holdToTalk}
        labelStyle="text"
        disabled={false}
        orb={null}
      />
      <TalkBar
        {...bar}
        label={talkCopy.listening(SAMPLE_LISTENING_MS)}
        labelStyle="timer"
        disabled={false}
        orb="level"
      />
      <TalkBar
        {...bar}
        label={talkCopy.understanding}
        labelStyle="text"
        disabled={false}
        orb="breathe"
      />
      <TalkBar
        {...bar}
        label={talkCopy.holdToTalk}
        labelStyle="text"
        disabled
        orb={null}
      />
    </GallerySection>
  );
}
