import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import { frameCount, frameDuration, type SettingsLook } from "../guideTimeline";

export function useGuideFrame(look: SettingsLook): number {
  const reducedMotion = useReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const next = () => setFrame((current) => (current + 1) % frameCount(look));
    const timer = setTimeout(next, frameDuration(look, frame));
    return () => clearTimeout(timer);
  }, [frame, look, reducedMotion]);

  return reducedMotion ? frameCount(look) - 1 : frame;
}
