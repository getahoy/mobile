import { useCallback, useEffect, useState } from "react";
import {
  changeHistorySettings,
  readHistorySettings,
} from "../client/historyApi";
import {
  clearHistoryEntries,
  keepsHistory,
  rememberKeepHistory,
} from "../storage/historyStore";

function keep(on: boolean): void {
  rememberKeepHistory(on);
  if (!on) clearHistoryEntries();
}

export function useHistorySettings() {
  const [keepHistory, setKeepHistory] = useState(keepsHistory);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    void readHistorySettings().then((settings) => {
      if (settings.code !== "success") return;
      keep(settings.data.keepHistory);
      setKeepHistory(settings.data.keepHistory);
    });
  }, []);

  const change = useCallback(async (on: boolean) => {
    setChanging(true);
    const changed = await changeHistorySettings({ keepHistory: on });
    setChanging(false);
    if (changed.code !== "success") return false;
    keep(changed.data.keepHistory);
    setKeepHistory(changed.data.keepHistory);
    return true;
  }, []);

  return { keepHistory, changing, change };
}
