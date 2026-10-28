import Constants from "expo-constants";
import { z } from "zod";
import { Text } from "@/components/ui/text";
import { homeCopy } from "../copy/homeCopy";

const buildExtraSchema = z.object({ gitCommit: z.string() });

const commit =
  buildExtraSchema.safeParse(Constants.expoConfig?.extra).data?.gitCommit ??
  "unknown";
const loadedAt = new Date().toLocaleTimeString();

export function DevBuildStamp() {
  if (!__DEV__) return null;
  return (
    <Text className="text-xs text-muted-foreground">
      {homeCopy.devStamp(commit, loadedAt)}
    </Text>
  );
}
