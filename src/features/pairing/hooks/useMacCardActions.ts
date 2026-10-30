import { router } from "expo-router";
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
  const removal = useUnpairMac(mac, connection, onChanged);
  const pairAgain = () =>
    router.push({ pathname: "/pair", params: { mac: mac.displayName } });
  const dismiss = () =>
    void removePairedMac(mac.publicKey)
      .catch(() => undefined)
      .finally(onChanged);
  const actions = cardActions(state, connection, { pairAgain, dismiss });
  const link: MacCardAction | null =
    state.kind === "ended" || !connection
      ? null
      : state.kind === "paused"
        ? toggle(macCopy.connect, () => connection.resume())
        : toggle(macCopy.disconnect, () => connection.pause());
  return { actions, link, removal };
}

function toggle(label: string, onPress: () => void): MacCardAction {
  return { label, tone: "primary", onPress };
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
