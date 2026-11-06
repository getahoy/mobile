import type { ReactNode } from "react";
import { HistoryContext } from "../hooks/historyContext";
import { useHistoryState } from "../hooks/useHistoryState";

export function HistoryProvider({ children }: { children: ReactNode }) {
  const history = useHistoryState();
  return <HistoryContext value={history}>{children}</HistoryContext>;
}
