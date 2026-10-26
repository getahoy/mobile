import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { homeCopy } from "../copy/homeCopy";

export function NoMacsYet() {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-4">
      <Text variant="h4">{homeCopy.emptyTitle}</Text>
      <Text className="text-center text-muted-foreground">
        {homeCopy.emptyBody}
      </Text>
      <Button onPress={() => router.push("/pair")}>
        <Text>{homeCopy.scan}</Text>
      </Button>
    </View>
  );
}
