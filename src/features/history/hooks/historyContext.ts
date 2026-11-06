import { createContext, useContext } from "react";
import type { useHistoryState } from "./useHistoryState";

type HistoryState = ReturnType<typeof useHistoryState>;

export const HistoryContext = createContext<HistoryState | null>(null);

export function useHistory(): HistoryState {
  const history = useContext(HistoryContext);
  if (!history) throw new Error("useHistory runs inside HistoryProvider");
  return history;
}
