import { useState } from "react";
import { View } from "react-native";
import { ConfirmSheet } from "@/components/ui/confirmSheet";
import { useMacCardActions } from "../hooks/useMacCardActions";
import { useMacLink } from "../hooks/useMacLink";
import { macStatus, statusLine } from "../macStatus";
import type { PairedMac } from "../storage/pairedMacs";
import { useSelectedMac } from "../storage/selectedMac";
import { HomeHeader } from "./homeHeader";
import { MacChip } from "./macChip";
import { MacMessageCard } from "./macMessageCard";
import { MoreOptionsSheet } from "./moreOptionsSheet";

type HomeMacProps = {
  mac: PairedMac;
  macs: readonly PairedMac[];
  onChanged: () => void;
};

export function HomeMac({ mac, macs, onChanged }: HomeMacProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { select } = useSelectedMac();
  const { state, connection } = useMacLink(mac);
  const status = macStatus(state, mac.displayName);
  const { actions, link, removal } = useMacCardActions({
    mac,
    state,
    connection,
    onChanged,
  });
  const canOpen = state.kind !== "ended";
  const chip = (
    <MacChip
      name={mac.displayName}
      status={status}
      onPress={canOpen ? () => setMenuOpen(true) : null}
    />
  );
  return (
    <>
      <HomeHeader chip={chip} />
      {status.message ? (
        <View className="px-5 pt-2">
          <MacMessageCard message={status.message} actions={actions} />
        </View>
      ) : null}
      <MoreOptionsSheet
        open={menuOpen}
        mac={mac}
        statusLine={statusLine(status)}
        macs={macs}
        onSelect={select}
        link={link}
        onRemove={removal.askToRemove}
        onClose={() => setMenuOpen(false)}
      />
      <ConfirmSheet request={removal.confirm} />
    </>
  );
}
