import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearAllHistory } from "../client/historyApi";
import { type HistoryPages, keepEntries } from "../historyPages";
import { clearHistoryEntries } from "../storage/historyStore";
import { HISTORY_KEY, HistoryRequestError } from "./useHistoryQuery";

export function useClearHistory() {
  const client = useQueryClient();
  const clearing = useMutation({
    mutationFn: async () => {
      const cleared = await clearAllHistory();
      if (cleared.code !== "success") throw new HistoryRequestError("clear");
    },
    onSuccess: () => {
      clearHistoryEntries();
      client.setQueriesData<HistoryPages>({ queryKey: HISTORY_KEY }, (pages) =>
        pages ? keepEntries(pages, () => false) : pages,
      );
      void client.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });
  const clear = () =>
    clearing.mutateAsync().then(
      () => true,
      () => false,
    );
  return { clear, clearing: clearing.isPending };
}
