import { useEffect } from "react";
import { haptic } from "@/lib/haptics";
import { replyHaptic } from "../replyHaptic";
import type { TalkState } from "../talkState";

export function useReplyHaptic(state: TalkState): void {
  useEffect(() => {
    const event = replyHaptic(state);
    if (event) haptic(event);
  }, [state]);
}
