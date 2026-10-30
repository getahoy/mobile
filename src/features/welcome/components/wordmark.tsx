import { Text } from "@/components/ui/text";
import { welcomeCopy } from "../copy/welcomeCopy";

export function Wordmark() {
  return (
    <Text className="font-fraunces text-wordmark">{welcomeCopy.wordmark}</Text>
  );
}
