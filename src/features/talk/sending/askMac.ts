import type { SpeakTarget } from "@getahoy/protocol";
import { randomUUID } from "expo-crypto";
import type { MacSession } from "@/features/pairing/connection/macSession";
import type { TalkState } from "../talkState";
import { type MacRequest, sendCommand } from "./sendCommand";

export function commandRequest(text: string, speakOn: SpeakTarget): MacRequest {
  return { type: "command", commandId: randomUUID(), text, speakOn };
}

export function choiceRequest(parentId: string, number: number): MacRequest {
  const commandId = randomUUID();
  return { type: "command.choose", commandId, parentId, number };
}

// Pressing talk silences the Mac and keeps an open choice alive while the answer is spoken.
export function signalPress(
  session: MacSession | null,
  speakOn: SpeakTarget,
  choosingFor: string | null,
): void {
  if (!session) return;
  if (speakOn === "mac" || speakOn === "both") {
    session.send({ type: "speech.stop" });
  }
  if (choosingFor) {
    session.send({ type: "choice.extend", choiceId: choosingFor });
  }
}

export async function askMac(
  session: MacSession | null,
  request: MacRequest,
  heard: string,
  onState: (state: TalkState) => void,
): Promise<TalkState> {
  onState({ kind: "sending", heard, slow: false });
  const onSlow = () => onState({ kind: "sending", heard, slow: true });
  const answer = session
    ? await sendCommand(session, request, onSlow).catch(() => null)
    : null;
  if (answer?.kind === "result") {
    const { kind: _, ...result } = answer;
    const { commandId } = request;
    const receivedAt = Date.now();
    return { kind: "answered", commandId, heard, receivedAt, ...result };
  }
  const failure = answer?.kind === "noAnswer" ? "noAnswer" : "macUnreachable";
  return { kind: "failed", failure, heard };
}
