import type { HistoryQuery } from "@getahoy/protocol";
import type { HistoryView } from "./localEntries.ts";

export type ListPhase = "loading" | "ready" | "failed";

export const isDefaultView = (view: HistoryView) =>
  view.filter === "all" && !view.search.trim() && view.macKey === null;

export function queryOf(
  view: HistoryView,
  cursor: string | null,
): HistoryQuery {
  const search = view.search.trim();
  return {
    status: view.filter,
    ...(search ? { q: search } : {}),
    ...(view.macKey ? { macKey: view.macKey } : {}),
    ...(cursor ? { cursor } : {}),
  };
}
