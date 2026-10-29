import type { CommandChoice } from "@getahoy/protocol";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { talkCopy } from "../copy/talkCopy";

type ChoiceButtonsProps = {
  choices: readonly CommandChoice[];
  confirm: boolean;
  onChoose: (number: number) => void;
  onCancel: () => void;
};

export function ChoiceButtons(props: ChoiceButtonsProps) {
  const { choices, confirm, onChoose, onCancel } = props;
  const [only] = choices;
  if (confirm && only) {
    return (
      <>
        <Button
          variant="destructive"
          size="lg"
          className="h-14"
          onPress={() => onChoose(only.number)}
        >
          <Text className="text-lg">{only.label}</Text>
        </Button>
        <Button variant="outline" size="lg" className="h-14" onPress={onCancel}>
          <Text className="text-lg">{talkCopy.cancel}</Text>
        </Button>
      </>
    );
  }
  return choices.map((choice) => (
    <Button
      key={choice.number}
      variant="outline"
      size="lg"
      className="h-14 justify-start gap-4"
      accessibilityLabel={talkCopy.choiceLabel(choice.number, choice.label)}
      onPress={() => onChoose(choice.number)}
    >
      <Text className="text-xl font-bold">{choice.number}</Text>
      <Text className="text-lg" numberOfLines={1}>
        {choice.label}
      </Text>
    </Button>
  ));
}
