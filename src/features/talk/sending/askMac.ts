import type { SpeakTarget } from "@getahoy/protocol";
import { randomUUID } from "expo-crypto";
import type { MacSession } from "@/features/pairing/connection/macSession";
import type { TalkState } from "../talkState";
import {
  type MacRequest,
  RECEIVED_TIMEOUT_MS,
  SLOW_COMMAND_MS,
  sendCommand,
} from "./sendCommand";
import { type SessionLink, waitForSession } from "./waitForSession";

export function commandRequest(text: string, speakOn: SpeakTarget): MacRequest {
  return { type: "command", commandId: randomUUID(), text, speakOn };
}

export function choiceRequest(parentId: string, number: number): MacRequest {
  const commandId = randomUUID();
  return { type: "command.choose", commandId, parentId, number };
}

// Pressing talk silences the Mac and keeps an open choice alive while the answer is spoken.
// Stop goes out whatever the setting says now: the Mac may still be speaking under the old one.
export function signalPress(
  session: MacSession | null,
  choosingFor: string | null,
): void {
  if (!session) return;
  session.send({ type: "speech.stop" });
  if (choosingFor) {
    session.send({ type: "choice.extend", choiceId: choosingFor });
  }
}

// A link still reconnecting after unlock is waited for with the same limits as the Mac's receipt.
export async function askMac(
  link: SessionLink<MacSession>,
  request: MacRequest,
  heard: string,
  onState: (state: TalkState) => void,
): Promise<TalkState> {
  const { commandId } = request;
  onState({ kind: "sending", heard, slow: false, commandId });
  const onSlow = () =>
    onState({ kind: "sending", heard, slow: true, commandId });
  const slowLink = setTimeout(onSlow, SLOW_COMMAND_MS);
  const session = await waitForSession(link, RECEIVED_TIMEOUT_MS);
  clearTimeout(slowLink);
  const sentAt = Date.now();
  const answer = session
    ? await sendCommand(session, request, onSlow).catch(() => null)
    : null;
  if (answer?.kind === "result") {
    const { kind: _, ...result } = answer;
    const receivedAt = Date.now();
    return {
      kind: "answered",
      commandId,
      heard,
      sentAt,
      receivedAt,
      ...result,
    };
  }
  const failure = answer?.kind === "noAnswer" ? "noAnswer" : "macUnreachable";
  return { kind: "failed", failure, heard, commandId };
}
