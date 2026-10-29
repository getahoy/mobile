import { Platform, View } from "react-native";
import { Text } from "@/components/ui/text";
import { voiceCopy } from "../copy/voiceCopy";
import { useVoiceSettings } from "../hooks/useVoiceSettings";
import { SettingChoice } from "./settingChoice";

// Android has no silent switch, so the iOS-only silent mode row is not shown there.
const HAS_SILENT_SWITCH = Platform.OS === "ios";

export function VoiceSettingsSection() {
  const { settings, change } = useVoiceSettings();
  return (
    <View className="gap-4">
      <Text className="text-lg font-semibold">{voiceCopy.title}</Text>
      <SettingChoice
        label={voiceCopy.playsOn}
        options={voiceCopy.playsOnOptions}
        selected={settings.playsOn}
        onSelect={(playsOn) => change({ playsOn })}
      />
      <SettingChoice
        label={voiceCopy.policy}
        options={voiceCopy.policyOptions}
        selected={settings.policy}
        onSelect={(policy) => change({ policy })}
      />
      <SettingChoice
        label={voiceCopy.voice}
        options={voiceCopy.voiceOptions}
        selected={settings.voice}
        onSelect={(voice) => change({ voice })}
      />
      {HAS_SILENT_SWITCH ? (
        <SettingChoice
          label={voiceCopy.silentMode}
          options={voiceCopy.silentModeOptions}
          selected={settings.speakInSilentMode ? "on" : "off"}
          onSelect={(mode) => change({ speakInSilentMode: mode === "on" })}
        />
      ) : null}
    </View>
  );
}
