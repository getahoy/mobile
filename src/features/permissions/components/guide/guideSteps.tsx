import { View } from "react-native";
import { GuideStep } from "./guideStep";

type GuideStepsProps = { steps: readonly string[]; active: number };

export function GuideSteps({ steps, active }: GuideStepsProps) {
  return (
    <View role="list" className="gap-2.5 px-1">
      {steps.map((text, index) => (
        <GuideStep
          key={text}
          number={index + 1}
          text={text}
          active={index === active}
        />
      ))}
    </View>
  );
}
