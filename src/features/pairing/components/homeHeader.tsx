import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { homeCopy } from "../copy/homeCopy";

export function HomeHeader() {
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="title">{homeCopy.title}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={homeCopy.account}
        onPress={() => router.push("/account")}
        className="size-11 items-center justify-center rounded-full"
      >
        <Icon name="settings" size="lg" />
      </Pressable>
    </View>
  );
}
