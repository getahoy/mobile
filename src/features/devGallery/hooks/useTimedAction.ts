import { useEffect, useState } from "react";

export function useTimedAction(durationMs: number) {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setRunning(false), durationMs);
    return () => clearTimeout(timer);
  }, [running, durationMs]);

  return { running, run: () => setRunning(true) };
}
