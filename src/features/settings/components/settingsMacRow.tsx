import { useState } from "react";
import { ConfirmSheet } from "@/components/ui/confirmSheet";
import { ListRow } from "@/components/ui/listRow";
import { MoreOptionsSheet } from "@/features/pairing/components/moreOptionsSheet";
import { macCopy } from "@/features/pairing/copy/macCopy";
import { useMacCardActions } from "@/features/pairing/hooks/useMacCardActions";
import { useMacLink } from "@/features/pairing/hooks/useMacLink";
import { macStatus, statusLine } from "@/features/pairing/macStatus";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";

type SettingsMacRowProps = { mac: PairedMac; onChanged: () => void };

const noMacs: readonly PairedMac[] = [];
const noop = () => undefined;

export function SettingsMacRow({ mac, onChanged }: SettingsMacRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { state, connection } = useMacLink(mac);
  const status = macStatus(state, mac.displayName);
  const { link, removal } = useMacCardActions({
    mac,
    state,
    connection,
    onChanged,
  });
  return (
    <>
      <ListRow
        label={mac.displayName}
        tone="strong"
        value={status.chip || macCopy.connectedWord}
        onPress={() => setMenuOpen(true)}
      />
      <MoreOptionsSheet
        open={menuOpen}
        mac={mac}
        statusLine={statusLine(status)}
        macs={noMacs}
        onSelect={noop}
        link={link}
        onRemove={removal.askToRemove}
        onClose={() => setMenuOpen(false)}
      />
      <ConfirmSheet request={removal.confirm} />
    </>
  );
}
