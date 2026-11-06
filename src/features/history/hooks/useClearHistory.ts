import { useCallback, useState } from "react";
import { clearAllHistory } from "../client/historyApi";
import { clearHistoryEntries } from "../storage/historyStore";

export function useClearHistory() {
  const [clearing, setClearing] = useState(false);
  const clear = useCallback(async () => {
    setClearing(true);
    const cleared = await clearAllHistory();
    setClearing(false);
    if (cleared.code !== "success") return false;
    clearHistoryEntries();
    return true;
  }, []);
  return { clear, clearing };
}
