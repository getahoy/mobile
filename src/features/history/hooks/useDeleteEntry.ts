import { useCallback } from "react";
import { deleteHistoryEntry } from "../client/historyApi";
import type { OutboxItem } from "../historyOutbox";
import { readOutbox, removeFromOutbox } from "../storage/historyStore";

export type Deleted = { id: string; unsent: OutboxItem | null };

// An entry that never reached the server is not found there; deleting it locally is enough.
export function useDeleteEntry() {
  return useCallback(async (id: string): Promise<Deleted | null> => {
    const unsent = readOutbox()[id] ?? null;
    removeFromOutbox(id);
    const deleted = await deleteHistoryEntry(id);
    if (deleted.code === "success") return { id, unsent };
    const missing =
      deleted.error.kind === "api" && deleted.error.detail.code === "not_found";
    if (missing && unsent) return { id, unsent };
    return null;
  }, []);
}
