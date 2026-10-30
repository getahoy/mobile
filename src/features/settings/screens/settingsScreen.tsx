import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { AccountGroup } from "@/features/auth/components/accountGroup";
import { SignOutRow } from "@/features/auth/components/signOutRow";
import { VoiceSettingsSection } from "@/features/voice/components/voiceSettingsSection";
import { MacsGroup } from "../components/macsGroup";
import { settingsCopy } from "../copy/settingsCopy";

type SettingsScreenProps = { name: string; email: string };

export function SettingsScreen({ name, email }: SettingsScreenProps) {
  return (
    <View className="flex-1 bg-sailcloth pt-safe">
      <View className="h-14 flex-row items-center gap-1 px-2">
        <Pressable
          role="button"
          accessibilityLabel={settingsCopy.back}
          onPress={() => router.back()}
          className="size-11 items-center justify-center rounded-full active:bg-linen"
        >
          <Icon name="chevronLeft" size="lg" />
        </Pressable>
        <Text variant="title" role="heading">
          {settingsCopy.title}
        </Text>
      </View>
      <ScrollView contentContainerClassName="gap-6 px-5 pt-2 pb-safe-offset-6">
        <MacsGroup />
        <VoiceSettingsSection />
        <AccountGroup name={name} email={email} />
        <SignOutRow />
      </ScrollView>
    </View>
  );
}
