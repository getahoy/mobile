import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { homeCopy } from "../copy/homeCopy";
import { Icon } from "./icon";

const GEAR_ICON_SIZE = 24;

export function HomeHeader() {
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="h3">{homeCopy.title}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={homeCopy.account}
        onPress={() => router.push("/account")}
        className="size-11 items-center justify-center rounded-full"
      >
        <Icon
          name="settings-outline"
          size={GEAR_ICON_SIZE}
          colorClassName="accent-foreground"
        />
      </Pressable>
    </View>
  );
}
