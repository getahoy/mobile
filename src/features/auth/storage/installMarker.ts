import { createMMKV } from "react-native-mmkv";

const INSTALL_SEEN_KEY = "installSeen";

const installStorage = createMMKV({ id: "ahoy.install" });

export function readInstallSeen(): boolean {
  return installStorage.getBoolean(INSTALL_SEEN_KEY) === true;
}

export function markInstallSeen(): void {
  installStorage.set(INSTALL_SEEN_KEY, true);
}
