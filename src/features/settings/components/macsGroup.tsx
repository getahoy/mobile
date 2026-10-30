import { router } from "expo-router";
import { ListGroup } from "@/components/ui/listGroup";
import { ListRow } from "@/components/ui/listRow";
import { homeCopy } from "@/features/pairing/copy/homeCopy";
import { usePairedMacs } from "@/features/pairing/hooks/usePairedMacs";
import { settingsCopy } from "../copy/settingsCopy";
import { SettingsMacRow } from "./settingsMacRow";

export function MacsGroup() {
  const { macs, reload } = usePairedMacs();
  return (
    <ListGroup header={settingsCopy.macs}>
      {(macs ?? []).map((mac) => (
        <SettingsMacRow key={mac.publicKey} mac={mac} onChanged={reload} />
      ))}
      <ListRow
        label={homeCopy.addAnother}
        onPress={() => router.push("/pair")}
      />
    </ListGroup>
  );
}
