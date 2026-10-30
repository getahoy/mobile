import { useState } from "react";
import { Platform } from "react-native";
import { ListGroup } from "@/components/ui/listGroup";
import { ListRow } from "@/components/ui/listRow";
import { Switch } from "@/components/ui/switch";
import { voiceCopy } from "../copy/voiceCopy";
import { useVoiceSettings } from "../hooks/useVoiceSettings";
import { type VoiceField, voiceFields, voiceValueLabel } from "../voiceFields";
import { VoiceSheets } from "./voiceSheets";

// Android has no silent switch, so the iOS-only silent mode row is not shown there.
const HAS_SILENT_SWITCH = Platform.OS === "ios";

const ROWS: readonly VoiceField[] = ["playsOn", "policy", "voice"];

export function VoiceSettingsSection() {
  const { settings, change } = useVoiceSettings();
  const [open, setOpen] = useState<VoiceField | null>(null);
  const muted = settings.playsOn === "off";
  return (
    <>
      <ListGroup header={voiceCopy.title} footer={voiceCopy.footer}>
        {ROWS.map((field) => (
          <ListRow
            key={field}
            label={voiceFields[field].title}
            value={voiceValueLabel(field, settings)}
            disabled={field !== "playsOn" && muted}
            onPress={() => setOpen(field)}
          />
        ))}
        {HAS_SILENT_SWITCH ? (
          <ListRow
            label={voiceCopy.silentMode}
            disabled={muted}
            accessory={
              <Switch
                checked={settings.speakInSilentMode}
                disabled={muted}
                onCheckedChange={(on) => change({ speakInSilentMode: on })}
                accessibilityLabel={voiceCopy.silentMode}
              />
            }
          />
        ) : null}
      </ListGroup>
      <VoiceSheets
        open={open}
        settings={settings}
        onChange={change}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
