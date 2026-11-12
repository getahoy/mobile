import type { HistoryView } from "./localEntries.ts";

export const isDefaultView = (view: HistoryView) =>
  view.filter === "all" && !view.search.trim() && view.macKey === null;
