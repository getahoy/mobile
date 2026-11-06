import { useCallback } from "react";
import { restoreHistoryEntry } from "../client/historyApi";
import { updateOutbox } from "../storage/historyStore";
import { flushHistory } from "../sync/flushHistory";
import type { Deleted } from "./useDeleteEntry";

export function useRestoreEntry() {
  return useCallback(async ({ id, unsent }: Deleted) => {
    if (unsent) {
      updateOutbox((outbox) => ({ ...outbox, [id]: unsent }));
      void flushHistory();
    }
    const restored = await restoreHistoryEntry(id);
    return restored.code === "success" || unsent !== null;
  }, []);
}
