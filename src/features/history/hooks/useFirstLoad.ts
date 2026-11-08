import { useSpinnerVisible } from "@/lib/useSpinnerVisible";

// The waiting state keeps its place until its own spinner may leave, so it never flickers.
export function useFirstLoad(waiting: boolean) {
  const held = useSpinnerVisible(waiting);
  return { busy: waiting, showLoader: waiting || held };
}
