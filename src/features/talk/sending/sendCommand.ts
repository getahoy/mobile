import type { CommandChoice, CommandStatus, Frame } from "@getahoy/protocol";
import type { MacSession } from "@/features/pairing/connection/macSession";

const RECEIVED_TIMEOUT_MS = 5000;
// Covers the Mac asking the interpreter (7 s) and then running an action (5 s).
const RESULT_TIMEOUT_MS = 15_000;
const SLOW_COMMAND_MS = 3000;

export type CommandAnswer =
  | {
      kind: "result";
      threadId: string;
      status: CommandStatus;
      message: string;
      speech: string | null;
      choices: readonly CommandChoice[];
      confirm: boolean;
    }
  | { kind: "unreachable" }
  | { kind: "noAnswer" };

export type MacRequest = Extract<Frame, { type: "command" | "command.choose" }>;

export function sendCommand(
  session: MacSession,
  request: MacRequest,
  onSlow: () => void,
): Promise<CommandAnswer> {
  const { commandId } = request;
  if (!session.isOpen()) return Promise.resolve({ kind: "unreachable" });
  return new Promise((resolve) => {
    let timer = setTimeout(
      () => settle({ kind: "unreachable" }),
      RECEIVED_TIMEOUT_MS,
    );
    let slowTimer: ReturnType<typeof setTimeout> | null = null;
    let received = false;
    const unsubscribe = session.onEvent((event) => {
      if (event.kind === "closed") {
        settle(received ? { kind: "noAnswer" } : { kind: "unreachable" });
        return;
      }
      if (event.kind !== "commandReply") return;
      const { reply } = event;
      if (reply.commandId !== commandId) return;
      if (reply.type === "command.result") {
        const { threadId, status, message, choices, confirm } = reply;
        const speech = reply.speech ?? null;
        const result = { threadId, status, message, speech, choices, confirm };
        settle({ kind: "result", ...result });
        return;
      }
      if (received) return;
      received = true;
      clearTimeout(timer);
      timer = setTimeout(() => settle({ kind: "noAnswer" }), RESULT_TIMEOUT_MS);
      slowTimer = setTimeout(onSlow, SLOW_COMMAND_MS);
    });
    function settle(answer: CommandAnswer) {
      clearTimeout(timer);
      if (slowTimer) clearTimeout(slowTimer);
      unsubscribe();
      resolve(answer);
    }
    session.send(request);
  });
}
