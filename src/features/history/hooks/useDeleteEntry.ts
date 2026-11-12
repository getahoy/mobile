import { doneOrGone } from "@getahoy/lib";
import { useCallback } from "react";
import { historyApi } from "../client/historyApi";
import type { OutboxItem } from "../historyOutbox";
import { readOutbox, removeFromOutbox } from "../storage/historyStore";

export type Deleted = { id: string; unsent: OutboxItem | null };

// An entry that never reached the server is not found there; deleting it locally is enough.
// The outbox copy goes only once the delete is settled, so a failed call loses nothing.
export function useDeleteEntry() {
  return useCallback(async (id: string): Promise<Deleted | null> => {
    const unsent = readOutbox()[id] ?? null;
    const deleted = await historyApi.remove(id);
    const gone = unsent !== null && doneOrGone(deleted);
    if (deleted.code !== "success" && !gone) return null;
    removeFromOutbox(id);
    return { id, unsent };
  }, []);
}
