import { useEffect } from "react";
import { useCarousel } from "@/components/ui/carouselContext";
import { markTryNudgeSeen, tryNudgeSeen } from "../storage/tryNudge";

const NUDGE_DELAY_MS = 1200;
const NUDGE_PX = 24;

export function useTryNudge(slideSpacing: number) {
  const { motion, peek } = useCarousel();
  useEffect(() => {
    if (motion === "reduced" || tryNudgeSeen()) return;
    const timer = setTimeout(() => {
      markTryNudgeSeen();
      peek(NUDGE_PX / slideSpacing);
    }, NUDGE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [motion, peek, slideSpacing]);
}
