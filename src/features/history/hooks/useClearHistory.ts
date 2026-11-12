import { HISTORY_KEY, withoutEntries } from "@getahoy/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { historyApi } from "../client/historyApi";
import type { HistoryPages } from "../historyPages";
import { clearHistoryEntries } from "../storage/historyStore";
import { HistoryRequestError } from "./useHistoryQuery";

export function useClearHistory() {
  const client = useQueryClient();
  const clearing = useMutation({
    mutationFn: async () => {
      const cleared = await historyApi.clear();
      if (cleared.code !== "success") throw new HistoryRequestError("clear");
    },
    onSuccess: () => {
      clearHistoryEntries();
      client.setQueriesData<HistoryPages>({ queryKey: HISTORY_KEY }, (pages) =>
        pages ? withoutEntries(pages, () => false) : pages,
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
