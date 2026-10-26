import { getNetworkStateAsync } from "expo-network";
import { Alert } from "react-native";
import { macCopy } from "../copy/macCopy";
import { readPairedMacs } from "../storage/pairedMacs";
import { unpairEverything } from "../sync/linkSync";
import { useLiveMacLinks } from "./useLiveMacLinks";

async function askToSignOut(): Promise<boolean> {
  const macs = (await readPairedMacs()).filter((mac) => !mac.ended);
  if (macs.length === 0) return true;
  const names = macs.map((mac) => mac.displayName).join(", ");
  const network = await getNetworkStateAsync().catch(() => null);
  const offline = network?.isInternetReachable === false;
  const body = offline
    ? macCopy.signOutOfflineBody(names)
    : macCopy.signOutBody(names);
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
  return async (signOut: () => void): Promise<void> => {
    if (!(await askToSignOut().catch(() => true))) return;
    await unpairEverything(live).catch(() => undefined);
    signOut();
  };
}
