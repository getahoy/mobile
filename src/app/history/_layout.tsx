import { Stack } from "expo-router";
import { HistoryProvider } from "@/features/history/components/historyProvider";
import { HistoryToastSlot } from "@/features/history/components/historyToastSlot";
import { useReducedMotion } from "@/lib/motion";

export default function HistoryLayout() {
  const reducedMotion = useReducedMotion();
  const animation = reducedMotion ? "fade" : "default";
  return (
    <HistoryProvider>
      <Stack screenOptions={{ headerShown: false, animation }} />
      <HistoryToastSlot />
    </HistoryProvider>
  );
}
