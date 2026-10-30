import type { CommandStatus } from "@getahoy/protocol";

export type ThreadLine = { id: string; speaker: "you" | "ahoy"; text: string };

export type ThreadStatus = CommandStatus | "open" | "expired" | "replaced";

export type Thread = {
  threadId: string;
  lines: readonly ThreadLine[];
  status: ThreadStatus;
  rounds: number;
  durationMs: number;
};

export type ThreadEvent =
  | {
      kind: "result";
      commandId: string;
      threadId: string;
      heard: string;
      message: string;
      status: CommandStatus;
      asks: boolean;
      durationMs: number;
    }
  | { kind: "expired"; threadId: string };

export type ThreadState = { current: Thread | null; replaced: Thread | null };

export const noThreads: ThreadState = { current: null, replaced: null };

type Result = Extract<ThreadEvent, { kind: "result" }>;

function statusOf(result: Result): ThreadStatus {
  return result.asks ? "open" : result.status;
}

function lines({ commandId, heard, message }: Result): ThreadLine[] {
  return [
    { id: `${commandId}-you`, speaker: "you", text: heard },
    { id: `${commandId}-ahoy`, speaker: "ahoy", text: message },
  ];
}

function started(result: Result): Thread {
  return {
    threadId: result.threadId,
    lines: lines(result),
    status: statusOf(result),
    rounds: 0,
    durationMs: result.durationMs,
  };
}

function withStatus(thread: Thread, status: ThreadStatus): Thread {
  return { ...thread, status };
}

// Follow-ups join a thread only through its id, which the Mac sets when it asked something back.
export function threadReducer(
  state: ThreadState,
  event: ThreadEvent,
): ThreadState {
  const { current } = state;
  if (event.kind === "expired") {
    const open =
      current?.threadId === event.threadId && current.status === "open";
    return open ? { ...state, current: withStatus(current, "expired") } : state;
  }
  if (current && current.threadId === event.threadId) {
    const next: Thread = {
      ...current,
      lines: [...current.lines, ...lines(event)],
      status: statusOf(event),
      rounds: current.rounds + 1,
      durationMs: event.durationMs,
    };
    return { ...state, current: next };
  }
  const stillOpen = current?.status === "open";
  const replaced = stillOpen ? withStatus(current, "replaced") : null;
  return { current: started(event), replaced };
}
