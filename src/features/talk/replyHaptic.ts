import type { HapticEvent } from "@/lib/hapticEvents";
import type { TalkState } from "./talkState.ts";

export function replyHaptic(state: TalkState): HapticEvent | null {
  switch (state.kind) {
    case "answered":
      if (state.choices.length > 0) return null;
      if (state.status === "done") return "commandDone";
      return state.status === "failed" ? "replyFailed" : null;
    case "failed":
      return "replyFailed";
    case "ready":
    case "tooShort":
    case "listening":
    case "understanding":
    case "sending":
      return null;
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}
