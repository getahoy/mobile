import { COMMAND_LOOKUP_CAPABILITY, type Frame } from "@getahoy/protocol";
import type {
  MacEvent,
  MacSession,
} from "@/features/pairing/connection/macSession";
import {
  type CommandAnswer,
  type CommandSend,
  openSession,
  RECEIVED_TIMEOUT_MS,
  RESULT_TIMEOUT_MS,
  SLOW_COMMAND_MS,
} from "./sendCommand";

type Result = Extract<Frame, { type: "command.result" }>;

const failureFor = (received: boolean): CommandAnswer =>
  received ? { kind: "noAnswer" } : { kind: "unreachable" };

function resultAnswer(reply: Result): CommandAnswer {
  const { threadId, status, message, choices, confirm } = reply;
  const { app, via, onMacMs, reason } = reply;
  const speech = reply.speech ?? null;
  const details = { app, via, onMacMs, reason };
  const shown = { threadId, status, message, speech, choices, confirm };
  return { kind: "result", ...shown, details };
}

// iOS closes the socket in the background while the Mac keeps running the
// command, so a lost link is waited out and the Mac is asked what became of it.
class CommandExchange {
  readonly #send: CommandSend;
  readonly #resolve: (answer: CommandAnswer) => void;
  readonly #stopWatching: () => void;
  #unsubscribe: (() => void) | null = null;
  #received = false;
  #awaitingReceipt = true;
  #timers: ReturnType<typeof setTimeout>[] = [];

  constructor(send: CommandSend, resolve: (answer: CommandAnswer) => void) {
    this.#send = send;
    this.#resolve = resolve;
    this.#stopWatching = send.line.activity.onChange(() => this.#arm());
  }

  start(session: MacSession): void {
    this.#attach(session);
    session.send(this.#send.request);
    this.#arm();
  }

  #attach(session: MacSession): void {
    const listen = (event: MacEvent) => this.#receive(session, event);
    this.#unsubscribe = session.onEvent(listen);
  }

  #receive(session: MacSession, event: MacEvent): void {
    if (event.kind === "closed") {
      void this.#relink();
      return;
    }
    if (event.kind !== "commandReply") return;
    const { reply } = event;
    if (reply.commandId !== this.#send.request.commandId) return;
    switch (reply.type) {
      case "command.result":
        this.#settle(resultAnswer(reply));
        return;
      case "command.received":
        this.#markReceived();
        return;
      case "command.unknown":
        this.#unknown(session);
        return;
      default: {
        const unhandled: never = reply;
        throw new Error(`Unhandled reply ${JSON.stringify(unhandled)}`);
      }
    }
  }

  #markReceived(): void {
    if (!this.#awaitingReceipt) return;
    this.#received = true;
    this.#awaitingReceipt = false;
    this.#arm();
  }

  // A Mac that had received the command and now does not know it restarted,
  // so sending it again could run it twice.
  #unknown(session: MacSession): void {
    if (this.#received) {
      this.#settle({ kind: "noAnswer" });
      return;
    }
    session.send(this.#send.request);
    this.#arm();
  }

  async #relink(): Promise<void> {
    this.#detach();
    const session = await openSession(this.#send.line);
    if (!session?.can(COMMAND_LOOKUP_CAPABILITY)) {
      return this.#settle(failureFor(this.#received));
    }
    this.#attach(session);
    this.#awaitingReceipt = true;
    const { commandId } = this.#send.request;
    session.send({ type: "command.lookup", commandId });
    this.#arm();
  }

  #arm(): void {
    this.#clearTimers();
    if (!this.#unsubscribe || !this.#send.line.activity.isActive()) return;
    if (this.#awaitingReceipt) {
      const missed = () => this.#settle(failureFor(this.#received));
      this.#timers = [setTimeout(missed, RECEIVED_TIMEOUT_MS)];
      return;
    }
    const noAnswer = () => this.#settle({ kind: "noAnswer" });
    this.#timers = [
      setTimeout(noAnswer, RESULT_TIMEOUT_MS),
      setTimeout(this.#send.onSlow, SLOW_COMMAND_MS),
    ];
  }

  #detach(): void {
    this.#clearTimers();
    this.#unsubscribe?.();
    this.#unsubscribe = null;
  }

  #clearTimers(): void {
    for (const timer of this.#timers) clearTimeout(timer);
    this.#timers = [];
  }

  #settle(answer: CommandAnswer): void {
    this.#detach();
    this.#stopWatching();
    this.#resolve(answer);
  }
}

export function sendCommand(
  session: MacSession,
  send: CommandSend,
): Promise<CommandAnswer> {
  return new Promise((resolve) => {
    new CommandExchange(send, resolve).start(session);
  });
}
