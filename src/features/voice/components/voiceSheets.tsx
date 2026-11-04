import { useVoicePreview } from "../hooks/useVoicePreview";
import { phaseOf } from "../previewState";
import type { VoiceSettings } from "../storage/voiceSettings";
import { type VoiceField, voiceFields } from "../voiceFields";
import { PreviewPill, previewActionLabel } from "./previewPill";
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
  const preview = useVoicePreview(open === "voice");
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
        accessory={(option) => {
          const phase = phaseOf(preview.state, option.key);
          const play = () => preview.toggle(option.key);
          return {
            node: (
              <PreviewPill
                voiceLabel={option.label}
                phase={phase}
                onPress={play}
              />
            ),
            actionLabel: previewActionLabel(option.label, phase),
            onAction: play,
          };
        }}
        onSelect={(next) => onChange({ voice: next })}
        onClose={onClose}
      />
    </>
  );
}
