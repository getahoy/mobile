import {
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "@/components/ui/toast";
import { historyCopy } from "../copy/historyCopy";
import { type HistoryPages, keepEntries } from "../historyPages";
import { useDeleteEntry } from "./useDeleteEntry";
import { HISTORY_KEY, HistoryRequestError } from "./useHistoryQuery";
import { useRestoreEntry } from "./useRestoreEntry";

const DELETE_KEY = ["deleteHistoryEntry"] as const;

// The row leaves at once, even an unsent one still in the outbox; Undo puts it back.
export function useEntryDeletion() {
  const client = useQueryClient();
  const remove = useDeleteEntry();
  const restore = useRestoreEntry();
  const refresh = () => client.invalidateQueries({ queryKey: HISTORY_KEY });
  const deletion = useMutation({
    mutationKey: DELETE_KEY,
    mutationFn: async (id: string) => {
      const deleted = await remove(id);
      if (!deleted) throw new HistoryRequestError(id);
      return deleted;
    },
    onSuccess: (deleted) => {
      client.setQueriesData<HistoryPages>({ queryKey: HISTORY_KEY }, (pages) =>
        pages ? keepEntries(pages, (entry) => entry.id !== deleted.id) : pages,
      );
      const undo = () => void restore(deleted).then(refresh);
      toast(historyCopy.deleted, { label: historyCopy.undo, onAction: undo });
    },
    onError: () => toast(historyCopy.couldNotDelete),
  });
  const pending = useMutationState({
    filters: { mutationKey: DELETE_KEY, status: "pending" },
    select: (mutation) => mutation.state.variables,
  });
  const deleting = useMemo(
    () => new Set(pending.filter((id) => typeof id === "string")),
    [pending],
  );
  return { deleting, deleteEntry: deletion.mutate };
}
