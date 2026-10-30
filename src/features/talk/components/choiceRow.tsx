import type { CommandChoice } from "@getahoy/protocol";
import { Pressable } from "react-native";
import { ChoiceTag } from "@/components/ui/choiceTag";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { talkCopy } from "../copy/talkCopy";

type ChoiceRowProps = {
  choice: CommandChoice;
  picked: boolean;
  disabled: boolean;
  onChoose: (number: number) => void;
};

export function ChoiceRow({
  choice,
  picked,
  disabled,
  onChoose,
}: ChoiceRowProps) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={talkCopy.choiceLabel(choice.number, choice.label)}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => onChoose(choice.number)}
      className={cn(
        "h-16 flex-row items-center gap-3.5 rounded-thumb px-1 active:bg-sailcloth",
        picked && "bg-signal-mist",
      )}
    >
      <ChoiceTag number={choice.number} selected={picked} />
      <Text numberOfLines={1} className="flex-1 font-sans-medium">
        {choice.label}
      </Text>
    </Pressable>
  );
}
