import type { SpeakTarget } from "@getahoy/protocol";
import { randomUUID } from "expo-crypto";
import type { MacSession } from "@/features/pairing/connection/macSession";
import type { TalkState } from "../talkState";
import { sendCommand } from "./commandExchange";
import {
  type MacLine,
  type MacRequest,
  openSession,
  SLOW_COMMAND_MS,
} from "./sendCommand";

type AskLine = MacLine & { onState: (state: TalkState) => void };

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
  line: AskLine,
  request: MacRequest,
  heard: string,
): Promise<TalkState> {
  const { commandId } = request;
  const { onState } = line;
  onState({ kind: "sending", heard, slow: false, commandId });
  const onSlow = () =>
    onState({ kind: "sending", heard, slow: true, commandId });
  const slowLink = setTimeout(onSlow, SLOW_COMMAND_MS);
  const session = await openSession(line);
  clearTimeout(slowLink);
  const sentAt = Date.now();
  const send = { line, request, onSlow };
  const answer = session
    ? await sendCommand(session, send).catch(() => null)
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
