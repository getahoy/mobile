import { historyCopy } from "../copy/historyCopy";
import type { BlankKind } from "../historyBlankState";
import { HistoryBlank } from "./historyBlank";
import { HistoryLoading } from "./historyLoading";

type HistoryListBlankProps = {
  kind: BlankKind;
  search: string;
  onRetry: () => void;
};

type BlankCopy = { eyebrow?: string; title: string; body: string };

function copyFor(kind: Exclude<BlankKind, "loading">, search: string) {
  const blanks: Record<Exclude<BlankKind, "loading">, BlankCopy> = {
    error: { title: historyCopy.errorTitle, body: historyCopy.errorBody },
    cleared: {
      eyebrow: historyCopy.clearedEyebrow,
      title: historyCopy.clearedTitle,
      body: historyCopy.clearedBody,
    },
    noMatch: {
      title: historyCopy.noMatchTitle(search.trim()),
      body: historyCopy.noMatchBody,
    },
    nothingFailed: {
      title: historyCopy.nothingFailedTitle,
      body: historyCopy.nothingFailedBody,
    },
    empty: { title: historyCopy.emptyTitle, body: historyCopy.emptyBody },
    nothingHere: { title: historyCopy.emptyTitle, body: historyCopy.emptyBody },
  };
  return blanks[kind];
}

export function HistoryListBlank({
  kind,
  search,
  onRetry,
}: HistoryListBlankProps) {
  if (kind === "loading") return <HistoryLoading />;
  const blank = copyFor(kind, search);
  const retry = { label: historyCopy.tryAgain, onPress: onRetry };
  return (
    <HistoryBlank {...blank} {...(kind === "error" ? { action: retry } : {})} />
  );
}
