import { ActivityIndicator, View } from "react-native";
import { authCopy } from "../copy/authCopy";

export function SessionLoading() {
  return (
    <View
      accessibilityLabel={authCopy["session.loading"]}
      className="flex-1 items-center justify-center bg-background"
    >
      <ActivityIndicator colorClassName="accent-muted-foreground" />
    </View>
  );
}
