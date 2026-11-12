import { APPEARANCES } from "@getahoy/lib";
import { View } from "react-native";
import { ListGroup } from "@/components/ui/listGroup";
import { appearanceCopy } from "../copy/appearanceCopy";
import { useAppearanceSwitch } from "../hooks/useAppearanceSwitch";
import { AppearanceTile } from "./appearanceTile";

export function AppearanceGroup() {
  const { chosen, applied, resolved, choose } = useAppearanceSwitch();
  return (
    <ListGroup
      header={appearanceCopy.title}
      footer={appearanceCopy.caption(applied, resolved)}
    >
      <View
        role="radiogroup"
        accessibilityLabel={appearanceCopy.title}
        className="flex-row justify-between bg-paper px-3.5 pt-4.5 pb-3.5"
      >
        {APPEARANCES.map((appearance) => (
          <AppearanceTile
            key={appearance}
            appearance={appearance}
            selected={chosen === appearance}
            onChoose={choose}
          />
        ))}
      </View>
    </ListGroup>
  );
}
