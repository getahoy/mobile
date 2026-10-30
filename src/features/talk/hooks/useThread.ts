import { useEffect, useReducer, useRef } from "react";
import type { TalkState } from "../talkState";
import { noThreads, threadReducer } from "../threads/threadStore";

export function useThread(state: TalkState) {
  const [threads, dispatch] = useReducer(threadReducer, noThreads);
  const previous = useRef(state);

  useEffect(() => {
    const before = previous.current;
    previous.current = state;
    if (state.kind !== "answered") {
      const asked = before.kind === "answered" && before.choices.length > 0;
      if (asked && state.kind === "ready") {
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
  }, [state]);

  return { thread: threads.current };
}
