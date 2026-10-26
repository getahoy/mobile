import { router } from "expo-router";
import { Alert } from "react-native";
import type { MacConnection } from "../connection/macConnection";
import type { MacLinkState } from "../connection/macLinkState";
import { macCopy } from "../copy/macCopy";
import { useMacConnection } from "../hooks/useMacConnection";
import { useUnpairMac } from "../hooks/useUnpairMac";
import type { PairedMac } from "../storage/pairedMacs";
import { type MacCardAction, MacLinkStatus } from "./macLinkStatus";

type LiveMacCardProps = { mac: PairedMac; onChanged: () => void };

function primaryAction(
  state: MacLinkState,
  mac: PairedMac,
  connection: MacConnection,
): MacCardAction | null {
  if (state.kind === "paused") {
    return { label: macCopy.connect, onPress: () => connection.resume() };
  }
  if (state.kind === "unreachable" && !state.onCellular) {
    return { label: macCopy.retry, onPress: () => connection.connect() };
  }
  if (state.kind === "unrecognised") {
    const params = { mac: mac.displayName };
    const onPress = () => router.push({ pathname: "/pair", params });
    return { label: macCopy.pairAgain, onPress };
  }
  return null;
}

export function LiveMacCard({ mac, onChanged }: LiveMacCardProps) {
  const { state, connection } = useMacConnection(mac, onChanged);
  const confirmRemove = useUnpairMac(mac, connection, onChanged);
  const paused = state.kind === "paused";
  const openMenu = () =>
    Alert.alert(mac.displayName, undefined, [
      paused
        ? { text: macCopy.connect, onPress: () => connection.resume() }
        : { text: macCopy.disconnect, onPress: () => connection.pause() },
      { text: macCopy.removeMac, style: "destructive", onPress: confirmRemove },
      { text: macCopy.cancel, style: "cancel" },
    ]);
  return (
    <MacLinkStatus
      macName={mac.displayName}
      state={state}
      action={primaryAction(state, mac, connection)}
      onMore={openMenu}
    />
  );
}
