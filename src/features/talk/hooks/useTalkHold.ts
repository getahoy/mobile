import { useState } from "react";
import { useBackToClose } from "@/lib/useBackToClose";
import type { TalkFlow } from "../sending/talkFlow";

export function useTalkHold(flow: TalkFlow) {
  const [pressed, setPressed] = useState(false);
  const hold = {
    onStart: () => {
      setPressed(true);
      void flow.press();
    },
    onStop: () => {
      setPressed(false);
      flow.release();
    },
    onInterrupted: () => {
      setPressed(false);
      flow.interrupt();
    },
  };
  useBackToClose(pressed, hold.onInterrupted);
  return { pressed, hold };
}
