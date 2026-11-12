import type { CommandChoice, CommandStatus, Frame } from "@getahoy/protocol";
import type { MacSession } from "@/features/pairing/connection/macSession";
import type { ResultDetails } from "../talkState";
import { type AppActivity, untilActive } from "./appActivity";
import { type SessionLink, waitForSession } from "./waitForSession";

export const RECEIVED_TIMEOUT_MS = 5000;
// Covers the Mac asking the interpreter (7 s) and then running an action (5 s).
export const RESULT_TIMEOUT_MS = 15_000;
export const SLOW_COMMAND_MS = 3000;

export type CommandAnswer =
  | {
      kind: "result";
      threadId: string;
      status: CommandStatus;
      message: string;
      speech: string | null;
      choices: readonly CommandChoice[];
      confirm: boolean;
      details: ResultDetails;
    }
  | { kind: "unreachable" }
  | { kind: "noAnswer" };

export type MacRequest = Extract<Frame, { type: "command" | "command.choose" }>;

export type MacLine = { link: SessionLink<MacSession>; activity: AppActivity };

export type CommandSend = {
  line: MacLine;
  request: MacRequest;
  onSlow: () => void;
};

export async function openSession(line: MacLine): Promise<MacSession | null> {
  const current = line.link.current();
  if (current?.isOpen()) return current;
  await untilActive(line.activity);
  return waitForSession(line.link, RECEIVED_TIMEOUT_MS);
}
