import { useEffect, useReducer, useRef, useState } from "react";
import type { TalkState } from "../talkState";
import { noThreads, threadReducer } from "../threads/threadStore";

function choiceLapsed(before: TalkState, now: TalkState): boolean {
  const asked = before.kind === "answered" && before.choices.length > 0;
  return asked && now.kind === "ready";
}

export function useThread(state: TalkState) {
  const [threads, dispatch] = useReducer(threadReducer, noThreads);
  const [expanded, setExpanded] = useState(false);
  const previous = useRef(state);

  useEffect(() => {
    const before = previous.current;
    previous.current = state;
    if (state.kind !== "answered") {
      if (before.kind === "answered" && choiceLapsed(before, state)) {
        dispatch({ kind: "expired", threadId: before.threadId });
      }
      return;
    }
    if (before.kind === "answered" && before.commandId === state.commandId) {
      return;
    }
    const { commandId, threadId, heard, message, status } = state;
    const asks = state.choices.length > 0;
    const result = { commandId, threadId, heard, message, status, asks };
    dispatch({ kind: "result", ...result });
    setExpanded(false);
  }, [state]);

  const toggle = () => setExpanded((open) => !open);
  return { thread: threads.current, expanded, toggle };
}
