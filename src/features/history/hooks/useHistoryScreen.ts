import { blankFor, listView } from "@getahoy/lib";
import { useState } from "react";
import { usePairedMacs } from "@/features/pairing/hooks/usePairedMacs";
import { historyCopy } from "../copy/historyCopy";
import { useHistory } from "./historyContext";
import { useFirstLoad } from "./useFirstLoad";

type OpenSheet = "picker" | "clear" | null;

export function useHistoryScreen() {
  const history = useHistory();
  const macs = usePairedMacs().macs ?? [];
  const [sheet, setSheet] = useState<OpenSheet>(null);
  const { list, filter, search, macKey, entries, unsynced } = history;
  const picking = macs.length > 1;
  const chosen = macs.find((mac) => mac.publicKey === macKey);
  const view = { filter, search, count: entries.length };
  const blank = blankFor({
    ...view,
    phase: list.phase,
    keepHistory: history.settings.keepHistory,
    signedOut: false,
    cleared: history.cleared,
  });
  const firstLoad = useFirstLoad(blank === "loading");
  const shown = listView({
    ...view,
    blank,
    summary: list.summary,
    summaryPending: list.summaryPending,
    offline: history.offline,
    stale: list.stale,
    manualFailure: list.errorAt === history.failedAt,
  });
  const notices = {
    offline: historyCopy.offline(unsynced.size),
    couldNotRefresh: historyCopy.couldNotRefresh,
  };
  const notice = shown.notice ? notices[shown.notice] : null;
  return {
    firstLoad,
    history,
    macs,
    sheet,
    setSheet,
    picking,
    chipLabel: chosen?.displayName || historyCopy.allMacs,
    showMac: picking && macKey === null,
    ...shown,
    notice,
    blank,
  };
}

export type HistoryScreenState = ReturnType<typeof useHistoryScreen>;
