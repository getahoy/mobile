import { createMMKV, useMMKVString } from "react-native-mmkv";

const SELECTED_MAC_KEY = "talk.selectedMac";

const talkTargetStorage = createMMKV({ id: "ahoy.talkTarget" });

export function useSelectedMac() {
  const [selectedKey, setSelectedKey] = useMMKVString(
    SELECTED_MAC_KEY,
    talkTargetStorage,
  );
  const select = (publicKey: string) => setSelectedKey(publicKey);
  return { selectedKey: selectedKey ?? null, select };
}
