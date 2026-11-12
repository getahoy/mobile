import { type BlankKind, blankCopy } from "@getahoy/lib";
import { historyCopy } from "../copy/historyCopy";
import { HistoryBlank } from "./historyBlank";

type HistoryListBlankProps = {
  kind: BlankKind;
  search: string;
  onRetry: () => void;
};

export function HistoryListBlank({
  kind,
  search,
  onRetry,
}: HistoryListBlankProps) {
  if (kind === "loading") return null;
  const blank = blankCopy(kind, search, historyCopy);
  const retry = { label: historyCopy.tryAgain, onPress: onRetry };
  return (
    <HistoryBlank {...blank} {...(kind === "error" ? { action: retry } : {})} />
  );
}
