import type { HistoryEntry } from "@getahoy/protocol";
import { setStringAsync } from "expo-clipboard";
import { router } from "expo-router";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { historyCopy } from "../copy/historyCopy";
import { needsRunConfirm } from "../historyView";
import { useHistory } from "./historyContext";
import { useReportProblem } from "./useReportProblem";
import { useRunAgain } from "./useRunAgain";

type EntrySheet = "runAgain" | "report" | null;

export function useEntryActions(entry: HistoryEntry) {
  const history = useHistory();
  const again = useRunAgain(entry);
  const { report, sending } = useReportProblem();
  const [sheet, setSheet] = useState<EntrySheet>(null);

  const copy = () => {
    const text = historyCopy.copiedText(entry.heard, entry.did);
    void setStringAsync(text).then(() => toast(historyCopy.copied));
  };
  const remove = () => {
    router.back();
    void history.deleteEntry(entry.id);
  };
  const runAgain = () => {
    if (needsRunConfirm(entry.heard)) setSheet("runAgain");
    else again.run();
  };
  const send = async (note: string) => {
    const sent = await report(entry.id, note);
    setSheet(null);
    toast(sent ? historyCopy.reportSent : historyCopy.couldNotReport);
  };
  const label = historyCopy.runAgain(entry.macName);
  const { ready, run } = again;
  const runAction = again.shown ? { label, ready, onPress: runAgain } : null;
  return { sheet, setSheet, sending, copy, remove, send, runAction, run };
}
