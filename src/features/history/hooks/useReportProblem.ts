import { useCallback, useState } from "react";
import { reportHistoryProblem } from "../client/historyApi";

export function useReportProblem() {
  const [sending, setSending] = useState(false);
  const report = useCallback(async (id: string, note: string) => {
    setSending(true);
    const sent = await reportHistoryProblem(id, note);
    setSending(false);
    return sent.code === "success";
  }, []);
  return { report, sending };
}
