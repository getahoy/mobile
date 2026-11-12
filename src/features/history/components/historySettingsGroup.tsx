import { router } from "expo-router";
import { useState } from "react";
import { ListGroup } from "@/components/ui/listGroup";
import { ListRow } from "@/components/ui/listRow";
import { Switch } from "@/components/ui/switch";
import { historyCopy } from "../copy/historyCopy";
import { useClearHistory } from "../hooks/useClearHistory";
import { useHistorySettings } from "../hooks/useHistorySettings";
import { ClearHistorySheet } from "./clearHistorySheet";

type Footer = "keep" | "cleared" | "failed" | "changeFailed";

const footers: Record<Footer, string> = {
  keep: historyCopy.keepHistoryFooter,
  cleared: historyCopy.clearedTitle,
  failed: historyCopy.couldNotClear,
  changeFailed: historyCopy.couldNotChange,
};

export function HistorySettingsGroup() {
  const { keepHistory, changing, change } = useHistorySettings();
  const { clear, clearing } = useClearHistory();
  const [confirming, setConfirming] = useState(false);
  const [footer, setFooter] = useState<Footer>("keep");
  const confirm = async () => {
    const cleared = await clear();
    setFooter(cleared ? "cleared" : "failed");
    setConfirming(false);
  };
  const turn = async (on: boolean) => {
    setFooter((await change(on)) ? "keep" : "changeFailed");
  };
  return (
    <>
      <ListGroup header={historyCopy.title} footer={footers[footer]}>
        <ListRow
          label={historyCopy.title}
          onPress={() => router.push("/history")}
        />
        <ListRow
          label={historyCopy.keepHistory}
          accessory={
            <Switch
              checked={keepHistory}
              disabled={changing}
              onCheckedChange={(on) => void turn(on)}
              accessibilityLabel={historyCopy.keepHistory}
            />
          }
        />
        <ListRow
          label={historyCopy.clearHistory}
          tone="destructive"
          disabled={!keepHistory}
          onPress={() => setConfirming(true)}
        />
      </ListGroup>
      <ClearHistorySheet
        open={confirming}
        clearing={clearing}
        onConfirm={() => void confirm()}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
