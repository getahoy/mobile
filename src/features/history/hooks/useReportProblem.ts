import { useCallback, useState } from "react";
import { historyApi } from "../client/historyApi";

export function useReportProblem() {
  const [sending, setSending] = useState(false);
  const report = useCallback(async (id: string, note: string) => {
    setSending(true);
    const sent = await historyApi.report(id, note);
    setSending(false);
    return sent.code === "success";
  }, []);
  return { report, sending };
}
