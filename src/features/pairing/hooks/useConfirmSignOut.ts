import { useState } from "react";
import { Alert } from "react-native";
import { macCopy } from "../copy/macCopy";
import { readPairedMacs } from "../storage/pairedMacs";
import { serverReachable, unpairEverything } from "../sync/linkSync";
import { useLiveMacLinks } from "./useLiveMacLinks";

async function askToSignOut(): Promise<boolean> {
  const macs = (await readPairedMacs()).filter((mac) => !mac.ended);
  if (macs.length === 0) return true;
  const names = macs.map((mac) => mac.displayName).join(", ");
  const online = await serverReachable().catch(() => false);
  const body = online
    ? macCopy.signOutBody(names)
    : macCopy.signOutOfflineBody(names);
  return new Promise((resolve) =>
    Alert.alert(macCopy.signOutTitle, body, [
      { text: macCopy.cancel, style: "cancel", onPress: () => resolve(false) },
      {
        text: macCopy.signOutConfirm,
        style: "destructive",
        onPress: () => resolve(true),
      },
    ]),
  );
}

export function useConfirmSignOut() {
  const live = useLiveMacLinks();
  const [checking, setChecking] = useState(false);
  const confirmSignOut = async (signOut: () => void): Promise<void> => {
    setChecking(true);
    const confirmed = await askToSignOut().catch(() => true);
    setChecking(false);
    if (!confirmed) return;
    await unpairEverything(live).catch(() => undefined);
    signOut();
  };
  return { checking, confirmSignOut };
}
