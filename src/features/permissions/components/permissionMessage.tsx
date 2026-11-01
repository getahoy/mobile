import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

type PermissionMessageProps = {
  title: string;
  body: string;
  children?: ReactNode;
};

export function PermissionMessage({
  title,
  body,
  children,
}: PermissionMessageProps) {
  return (
    <View className="flex-1 gap-3.5 px-6 pt-6">
      <Text variant="headline">{title}</Text>
      <Text className="text-driftwood">{body}</Text>
      {children}
    </View>
  );
}
