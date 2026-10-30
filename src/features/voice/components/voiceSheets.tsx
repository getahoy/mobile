import type { VoiceSettings } from "../storage/voiceSettings";
import { type VoiceField, voiceFields } from "../voiceFields";
import { VoiceOptionSheet } from "./voiceOptionSheet";

type VoiceSheetsProps = {
  open: VoiceField | null;
  settings: VoiceSettings;
  onChange: (update: Partial<VoiceSettings>) => void;
  onClose: () => void;
};

export function VoiceSheets({
  open,
  settings,
  onChange,
  onClose,
}: VoiceSheetsProps) {
  const { playsOn, policy, voice } = voiceFields;
  return (
    <>
      <VoiceOptionSheet
        open={open === "playsOn"}
        title={playsOn.title}
        options={playsOn.options}
        selected={settings.playsOn}
        onSelect={(next) => onChange({ playsOn: next })}
        onClose={onClose}
      />
      <VoiceOptionSheet
        open={open === "policy"}
        title={policy.title}
        options={policy.options}
        selected={settings.policy}
        onSelect={(next) => onChange({ policy: next })}
        onClose={onClose}
      />
      <VoiceOptionSheet
        open={open === "voice"}
        title={voice.title}
        options={voice.options}
        selected={settings.voice}
        onSelect={(next) => onChange({ voice: next })}
        onClose={onClose}
      />
    </>
  );
}
