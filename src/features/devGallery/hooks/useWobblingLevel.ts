import { useEffect, useState } from "react";

const TICK_MS = 120;
const WOBBLE_STEP = 0.7;

export function useWobblingLevel(): number {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPhase((at) => at + 1), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return Math.abs(Math.sin(phase * WOBBLE_STEP));
}
