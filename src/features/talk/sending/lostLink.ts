import { COMMAND_LOOKUP_CAPABILITY } from "@getahoy/protocol";

export type LostFailure = "unreachable" | "noAnswer";

export function failureFor(received: boolean): LostFailure {
  return received ? "noAnswer" : "unreachable";
}

type CapableMac = { can: (capability: string) => boolean };

export function afterLostLink(
  mac: CapableMac,
  received: boolean,
): "lookup" | LostFailure {
  if (mac.can(COMMAND_LOOKUP_CAPABILITY)) return "lookup";
  return failureFor(received);
}

// A Mac that had received the command and now does not know it restarted,
// so sending it again could run it twice.
export function afterUnknown(received: boolean): "resend" | "noAnswer" {
  return received ? "noAnswer" : "resend";
}
