import { useEffect } from "react";

const PAIRED_CONFIRMATION_MS = 1200;

export function useLeaveWhenPaired(paired: boolean, leave: () => void) {
  useEffect(() => {
    if (!paired) return;
    const timer = setTimeout(leave, PAIRED_CONFIRMATION_MS);
    return () => clearTimeout(timer);
  }, [paired, leave]);
}
