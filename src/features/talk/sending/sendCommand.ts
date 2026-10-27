import type { CommandStatus } from "@getahoy/protocol";
import type { MacSession } from "@/features/pairing/connection/macSession";

const RECEIVED_TIMEOUT_MS = 5000;
const RESULT_TIMEOUT_MS = 10_000;
const SLOW_COMMAND_MS = 3000;

export type CommandAnswer =
  | { kind: "result"; status: CommandStatus; message: string }
  | { kind: "unreachable" }
  | { kind: "noAnswer" };

type PendingCommand = { commandId: string; text: string };

export function sendCommand(
  session: MacSession,
  { commandId, text }: PendingCommand,
  onSlow: () => void,
): Promise<CommandAnswer> {
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
        const { status, message } = reply;
        settle({ kind: "result", status, message });
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
    session.send({ type: "command", commandId, text });
  });
}
