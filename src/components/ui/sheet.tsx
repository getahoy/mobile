import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Portal } from "@rn-primitives/portal";
import { type ReactNode, useEffect, useId, useRef } from "react";
import { View } from "react-native";
import { cn } from "@/lib/cn";
import { DrainBar } from "./drainBar";
import { SheetBackdrop } from "./sheetBackdrop";
import { SheetBackground } from "./sheetBackground";
import { Text } from "./text";

const CLOSED = -1;
const OPEN = 0;

type SheetProps = {
  open: boolean;
  onClose: () => void;
  onClosed?: () => void;
  title: string;
  description?: string;
  tone?: "plain" | "danger";
  drain?: { durationMs: number; running: boolean };
  children: ReactNode;
};

export function Sheet({
  open,
  onClose,
  onClosed,
  title,
  description,
  tone = "plain",
  drain,
  children,
}: SheetProps) {
  const portalName = useId();
  const sheet = useRef<BottomSheet>(null);
  const openNow = useRef(open);

  useEffect(() => {
    openNow.current = open;
    if (open) sheet.current?.snapToIndex(OPEN);
    else sheet.current?.close();
  }, [open]);

  return (
    <Portal name={portalName}>
      <BottomSheet
        ref={sheet}
        index={CLOSED}
        enablePanDownToClose
        enableDynamicSizing
        handleComponent={null}
        backgroundComponent={SheetBackground}
        backdropComponent={SheetBackdrop}
        onClose={() => {
          if (openNow.current) onClose();
          onClosed?.();
        }}
      >
        <BottomSheetView>
          <View
            accessibilityViewIsModal
            className="overflow-hidden rounded-t-sheet"
          >
            <View
              className={cn(
                "gap-1 px-5 pt-3 pb-4",
                tone === "danger" && "bg-flare-mist",
              )}
            >
              {drain ? <DrainBar {...drain} /> : null}
              <View className="mb-3 h-1.5 w-9 self-center rounded-full bg-ink/20" />
              <Text variant="title">{title}</Text>
              {description ? (
                <Text variant="bodySmall" className="text-driftwood">
                  {description}
                </Text>
              ) : null}
            </View>
            <View className="gap-3 px-5 pt-2 pb-safe-offset-5">{children}</View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
}
