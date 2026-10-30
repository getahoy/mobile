import { CHOICE_TTL_MS } from "@getahoy/protocol";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { talkCopy } from "../copy/talkCopy";
import { useChoiceSheet } from "../hooks/useChoiceSheet";
import type { TalkState } from "../talkState";
import { ChoiceRow } from "./choiceRow";

type ChoiceSheetProps = {
  state: TalkState;
  onChoose: (number: number) => void;
  onDismiss: () => void;
};

export function ChoiceSheet({ state, onChoose, onDismiss }: ChoiceSheetProps) {
  const sheet = useChoiceSheet(state, onChoose, onDismiss);
  const { shown, expired, picked } = sheet;
  const confirm = shown?.confirm ?? false;
  const [only] = shown?.choices ?? [];
  const title = expired
    ? talkCopy.expiredTitle
    : confirm
      ? (shown?.message ?? "")
      : talkCopy.choiceTitle;
  return (
    <Sheet
      open={shown !== null}
      onClose={sheet.dismiss}
      title={title}
      tone={confirm ? "danger" : "plain"}
      {...(confirm || expired ? {} : { description: shown?.message ?? "" })}
      {...(confirm
        ? {}
        : { drain: { durationMs: CHOICE_TTL_MS, running: !expired } })}
    >
      {confirm && only && !expired ? (
        <Button variant="destructive" onPress={() => sheet.choose(only.number)}>
          <Text>{only.label}</Text>
        </Button>
      ) : null}
      {confirm ? null : (
        <View className={cn(expired && "opacity-40")}>
          {shown?.choices.map((choice) => (
            <ChoiceRow
              key={choice.number}
              choice={choice}
              picked={picked === choice.number}
              disabled={expired}
              onChoose={sheet.choose}
            />
          ))}
        </View>
      )}
      <Button variant="ghost" onPress={sheet.dismiss}>
        <Text>{footerLabel(expired, confirm)}</Text>
      </Button>
      {confirm || expired ? null : (
        <Text variant="footnote" className="text-center text-driftwood">
          {talkCopy.sayNumber}
        </Text>
      )}
    </Sheet>
  );
}

function footerLabel(expired: boolean, confirm: boolean): string {
  if (expired) return talkCopy.close;
  return confirm ? talkCopy.cancel : talkCopy.noneOfThese;
}
