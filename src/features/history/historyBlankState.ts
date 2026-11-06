import type { HistoryFilter } from "@getahoy/protocol";
import type { ListPhase } from "./historyQuery.ts";

export type BlankKind =
  | "loading"
  | "error"
  | "cleared"
  | "noMatch"
  | "nothingFailed"
  | "empty"
  | "nothingHere";

type BlankInput = {
  phase: ListPhase;
  cleared: boolean;
  count: number;
  filter: HistoryFilter;
  search: string;
};

type FirstLoadInput = Pick<BlankInput, "phase" | "count">;

// Nothing cached and nothing waiting in the outbox: only then is there nothing to show yet.
export function waitsForFirstLoad({ phase, count }: FirstLoadInput): boolean {
  return phase === "loading" && count === 0;
}

export function blankFor(input: BlankInput): BlankKind | null {
  const { phase, cleared, count, filter, search } = input;
  if (count > 0) return null;
  if (phase === "loading") return "loading";
  if (phase === "failed") return "error";
  if (search.trim()) return "noMatch";
  if (filter === "failed") return "nothingFailed";
  if (filter === "done") return "nothingHere";
  return cleared ? "cleared" : "empty";
}
