import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { permissionCopy } from "../copy/permissionCopy";

type PermissionActionsProps = {
  label: string;
  onPress: () => void;
  onNotNow: () => void;
};

export function PermissionActions({
  label,
  onPress,
  onNotNow,
}: PermissionActionsProps) {
  return (
    <View className="gap-1.5 px-5 pt-3 pb-safe">
      <Button className="active:scale-97 active:opacity-100" onPress={onPress}>
        <Text>{label}</Text>
      </Button>
      <Button variant="ghost" onPress={onNotNow}>
        <Text>{permissionCopy.notNow}</Text>
      </Button>
    </View>
  );
}
