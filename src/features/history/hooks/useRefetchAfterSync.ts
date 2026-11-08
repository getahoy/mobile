import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { lastSentAt, type Outbox } from "../historyOutbox";
import { HISTORY_KEY } from "./useHistoryQuery";

// A send the shown list predates refetches History; the sent entry stays on screen meanwhile.
export function useRefetchAfterSync(outbox: Outbox, serverAt: number) {
  const client = useQueryClient();
  const sentAt = lastSentAt(outbox);
  const shownAt = useRef(serverAt);
  shownAt.current = serverAt;
  useEffect(() => {
    if (sentAt === 0 || sentAt < shownAt.current) return;
    void client.invalidateQueries({ queryKey: HISTORY_KEY });
  }, [client, sentAt]);
}
