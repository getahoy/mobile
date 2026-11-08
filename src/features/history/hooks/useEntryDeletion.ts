import { useCallback, useState } from "react";
import { historyCopy } from "../copy/historyCopy";
import { useDeleteEntry } from "./useDeleteEntry";
import { useRestoreEntry } from "./useRestoreEntry";
import type { Toast } from "./useToast";

type DeletionOptions = {
  reload: () => Promise<unknown>;
  show: (toast: Toast) => void;
};

function without(ids: ReadonlySet<string>, id: string) {
  const next = new Set(ids);
  next.delete(id);
  return next;
}

// The row leaves at once; Undo puts it back for as long as the toast is up.
export function useEntryDeletion({ reload, show }: DeletionOptions) {
  const remove = useDeleteEntry();
  const restore = useRestoreEntry();
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());

  const deleteEntry = useCallback(
    async (id: string) => {
      setHidden((ids) => new Set(ids).add(id));
      const deleted = await remove(id);
      if (!deleted) {
        setHidden((ids) => without(ids, id));
        show({ text: historyCopy.couldNotDelete, undo: null });
        return;
      }
      const undo = () =>
        void restore(deleted).then(() => {
          setHidden((ids) => without(ids, id));
          void reload();
        });
      show({ text: historyCopy.deleted, undo });
    },
    [remove, restore, reload, show],
  );

  return { hidden, deleteEntry };
}
