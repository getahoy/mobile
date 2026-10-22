import { authCopy, errorMessages } from "@getahoy/lib";
import type { ErrorBoundaryProps } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export function ErrorFallback({ retry }: ErrorBoundaryProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <Text accessibilityRole="alert">{errorMessages.internal}</Text>
      <Button onPress={retry}>
        <Text>{authCopy["action.retry"]}</Text>
      </Button>
    </View>
  );
}
