import { View } from "react-native";
import { useMacCardActions } from "../hooks/useMacCardActions";
import { useMacLink } from "../hooks/useMacLink";
import { macStatus } from "../macStatus";
import type { PairedMac } from "../storage/pairedMacs";
import { HomeHeader } from "./homeHeader";
import { MacChip } from "./macChip";
import { MacMessageCard } from "./macMessageCard";

type HomeMacProps = { mac: PairedMac; onChanged: () => void };

export function HomeMac({ mac, onChanged }: HomeMacProps) {
  const { state, connection } = useMacLink(mac);
  const status = macStatus(state, mac.displayName);
  const { actions, openMenu } = useMacCardActions({
    mac,
    state,
    connection,
    onChanged,
  });
  return (
    <>
      <HomeHeader
        chip={
          <MacChip name={mac.displayName} status={status} onPress={openMenu} />
        }
      />
      {status.message ? (
        <View className="px-5 pt-2">
          <MacMessageCard message={status.message} actions={actions} />
        </View>
      ) : null}
    </>
  );
}
