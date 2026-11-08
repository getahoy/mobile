import type { HistoryPage, HistoryQuery } from "@getahoy/protocol";
import type { HistoryView } from "./localEntries.ts";

export type ListPhase = "loading" | "ready" | "failed";

export type ListState = Omit<HistoryPage, "cursor"> & {
  phase: ListPhase;
  cursor: string | null;
  viewKey: string;
  stale: boolean;
  loadingMore: boolean;
};

export const viewKeyOf = ({ filter, search, macKey }: HistoryView) =>
  JSON.stringify([filter, search.trim(), macKey]);

export const isOverallView = (view: HistoryView) =>
  view.filter === "all" && !view.search.trim();

export const isDefaultView = (view: HistoryView) =>
  isOverallView(view) && view.macKey === null;

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

export function failedState(shown: ListState, viewKey: string): ListState {
  if (shown.viewKey === viewKey && shown.phase === "ready") {
    return { ...shown, stale: true };
  }
  return { ...shown, viewKey, phase: "failed", entries: [], summary: null };
}

export function loadedState(page: HistoryPage, viewKey: string): ListState {
  return { ...page, viewKey, phase: "ready", stale: false, loadingMore: false };
}

export function appendedState(shown: ListState, page: HistoryPage) {
  const entries = [...shown.entries, ...page.entries];
  return { ...shown, entries, cursor: page.cursor, loadingMore: false };
}
