import type { CommandChoice } from "@getahoy/protocol";
import { Button } from "@/components/ui/button";
import { ChoiceTag } from "@/components/ui/choiceTag";
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
        <Button variant="destructive" onPress={() => onChoose(only.number)}>
          <Text>{only.label}</Text>
        </Button>
        <Button variant="ghost" onPress={onCancel}>
          <Text>{talkCopy.cancel}</Text>
        </Button>
      </>
    );
  }
  return choices.map((choice) => (
    <Button
      key={choice.number}
      variant="secondary"
      className="justify-start gap-4 px-4"
      accessibilityLabel={talkCopy.choiceLabel(choice.number, choice.label)}
      onPress={() => onChoose(choice.number)}
    >
      <ChoiceTag number={choice.number} />
      <Text numberOfLines={1}>{choice.label}</Text>
    </Button>
  ));
}
