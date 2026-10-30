import { router } from "expo-router";
import { Alert } from "react-native";
import type { MacConnection } from "../connection/macConnection";
import type { MacLinkState } from "../connection/macLinkState";
import { macCopy } from "../copy/macCopy";
import { type PairedMac, removePairedMac } from "../storage/pairedMacs";
import { useUnpairMac } from "./useUnpairMac";

export type MacCardAction = {
  label: string;
  tone: "primary" | "secondary";
  onPress: () => void;
};

type MacCardActionsOptions = {
  mac: PairedMac;
  state: MacLinkState;
  connection: MacConnection | null;
  onChanged: () => void;
};

export function useMacCardActions(options: MacCardActionsOptions) {
  const { mac, state, connection, onChanged } = options;
  const confirmRemove = useUnpairMac(mac, connection, onChanged);
  const pairAgain = () =>
    router.push({ pathname: "/pair", params: { mac: mac.displayName } });
  const dismiss = () =>
    void removePairedMac(mac.publicKey)
      .catch(() => undefined)
      .finally(onChanged);
  const actions = cardActions(state, connection, { pairAgain, dismiss });
  const openMenu =
    state.kind === "ended" || !connection
      ? null
      : () =>
          Alert.alert(mac.displayName, undefined, [
            state.kind === "paused"
              ? { text: macCopy.connect, onPress: () => connection.resume() }
              : { text: macCopy.disconnect, onPress: () => connection.pause() },
            {
              text: macCopy.removeMac,
              style: "destructive",
              onPress: confirmRemove,
            },
            { text: macCopy.cancel, style: "cancel" },
          ]);
  return { actions, openMenu, confirmRemove };
}

type Navigation = { pairAgain: () => void; dismiss: () => void };

function cardActions(
  state: MacLinkState,
  connection: MacConnection | null,
  navigation: Navigation,
): MacCardAction[] {
  const { pairAgain, dismiss } = navigation;
  if (state.kind === "ended") {
    return [
      { label: macCopy.pairAgain, tone: "primary", onPress: pairAgain },
      { label: macCopy.dismiss, tone: "secondary", onPress: dismiss },
    ];
  }
  if (state.kind === "unrecognised") {
    return [
      { label: macCopy.pairAgain, tone: "secondary", onPress: pairAgain },
    ];
  }
  if (!connection) return [];
  if (state.kind === "paused") {
    const onPress = () => connection.resume();
    return [{ label: macCopy.connect, tone: "primary", onPress }];
  }
  if (state.kind === "unreachable" && !state.onCellular) {
    const onPress = () => connection.connect();
    return [{ label: macCopy.retry, tone: "secondary", onPress }];
  }
  return [];
}
