import { useCallback } from "react";
import { historyApi } from "../client/historyApi";
import { updateOutbox } from "../storage/historyStore";
import { flushHistory } from "../sync/flushHistory";
import type { Deleted } from "./useDeleteEntry";

export function useRestoreEntry() {
  return useCallback(async ({ id, unsent }: Deleted) => {
    if (unsent) {
      updateOutbox((outbox) => ({ ...outbox, [id]: unsent }));
      void flushHistory();
    }
    const restored = await historyApi.restore(id);
    return restored.code === "success" || unsent !== null;
  }, []);
}
