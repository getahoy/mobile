import { HISTORY_KEY } from "@getahoy/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { lastSentAt, type Outbox } from "../historyOutbox";

// A send the shown list predates refetches History; the sent entry stays on screen meanwhile.
// With no list yet, the first load already covers every send.
export function useRefetchAfterSync(outbox: Outbox, serverAt: number) {
  const client = useQueryClient();
  const sentAt = lastSentAt(outbox);
  useEffect(() => {
    if (serverAt === 0 || sentAt < serverAt) return;
    void client.invalidateQueries({ queryKey: HISTORY_KEY });
  }, [client, sentAt, serverAt]);
}
