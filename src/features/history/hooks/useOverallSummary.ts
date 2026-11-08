import type { HistoryPage } from "@getahoy/protocol";
import { useCallback, useEffect, useState } from "react";
import { fetchHistoryPage } from "../client/historyApi";
import { isOverallView, queryOf } from "../historyQuery";
import type { HistoryView } from "../localEntries";
import { readHistoryCache } from "../storage/historyStore";

type Summary = HistoryPage["summary"];
type Overall = { macKey: string | null; summary: Summary; settled: boolean };

function cachedOverall(): Overall {
  const { summary } = readHistoryCache();
  return { macKey: null, summary, settled: summary !== null };
}

// The summary always comes from the All view of the chosen Mac, whatever filter is showing.
export function useOverallSummary(view: HistoryView) {
  const [overall, setOverall] = useState(cachedOverall);
  const { macKey } = view;
  const mine = overall.macKey === macKey;
  const known = mine && overall.settled;
  const listLoadsIt = isOverallView(view);

  const settle = useCallback((forMac: string | null, summary: Summary) => {
    setOverall((shown) => {
      const keep = summary === null && shown.macKey === forMac && shown.settled;
      return keep ? shown : { macKey: forMac, summary, settled: true };
    });
  }, []);

  useEffect(() => {
    if (listLoadsIt || known) return;
    let live = true;
    const overallView = { filter: "all", search: "", macKey } as const;
    void fetchHistoryPage(queryOf(overallView, null)).then((page) => {
      if (!live) return;
      settle(macKey, page.code === "success" ? page.data.summary : null);
    });
    return () => {
      live = false;
    };
  }, [listLoadsIt, known, macKey, settle]);

  const summary = mine ? overall.summary : null;
  return { summary, summaryPending: !known, settle };
}
