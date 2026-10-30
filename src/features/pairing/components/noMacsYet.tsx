import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { homeCopy } from "../copy/homeCopy";

export function NoMacsYet() {
  return (
    <View className="flex-1 justify-center gap-3 px-6">
      <Text variant="title" className="text-center">
        {homeCopy.emptyTitle}
      </Text>
      <Text variant="bodySmall" className="text-center text-driftwood">
        {homeCopy.emptyBody}
      </Text>
      <Button className="mt-5" onPress={() => router.push("/pair")}>
        <Text>{homeCopy.scan}</Text>
      </Button>
    </View>
  );
}
