import { View } from "react-native";
import { ClearHistorySheet } from "../components/clearHistorySheet";
import { HistoryBody } from "../components/historyBody";
import { HistoryHeader } from "../components/historyHeader";
import { HistoryOff } from "../components/historyOff";
import { MacPickerChip } from "../components/macPickerChip";
import { MacPickerSheet } from "../components/macPickerSheet";
import { useHistoryScreen } from "../hooks/useHistoryScreen";

export function HistoryScreen() {
  const screen = useHistoryScreen();
  const { history, sheet, setSheet } = screen;
  const { settings } = history;
  const close = () => setSheet(null);
  const openPicker = () => setSheet("picker");
  const chip = screen.picking ? (
    <MacPickerChip label={screen.chipLabel} onPress={openPicker} />
  ) : null;
  const turnOn = () => void settings.change(true).then(history.list.reload);
  return (
    <View className="flex-1 bg-sailcloth pt-safe">
      <HistoryHeader trailing={settings.keepHistory ? chip : null} />
      {settings.keepHistory ? (
        <HistoryBody screen={screen} />
      ) : (
        <HistoryOff changing={settings.changing} onTurnOn={turnOn} />
      )}
      <MacPickerSheet
        open={sheet === "picker"}
        macs={screen.macs}
        selected={history.macKey}
        onPick={(macKey) => {
          history.setMacKey(macKey);
          close();
        }}
        onClose={close}
      />
      <ClearHistorySheet
        open={sheet === "clear"}
        clearing={history.clearing}
        onConfirm={() => void history.clearAll().then(close)}
        onClose={close}
      />
    </View>
  );
}
