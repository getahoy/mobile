import Constants from "expo-constants";
import { z } from "zod";
import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";

const buildExtraSchema = z.object({ gitCommit: z.string() });

const commit =
  buildExtraSchema.safeParse(Constants.expoConfig?.extra).data?.gitCommit ??
  "unknown";
const loadedAt = new Date().toLocaleTimeString();

export function BuildStamp() {
  return (
    <Text variant="caption">{galleryCopy.buildStamp(commit, loadedAt)}</Text>
  );
}
