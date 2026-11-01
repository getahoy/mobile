import { createMMKV, useMMKVBoolean } from "react-native-mmkv";
import { z } from "zod";

const INTRO_SEEN_KEY = "localNetwork.introSeen";
const REACHED_MACS_KEY = "localNetwork.reachedMacs";

const localNetworkStorage = createMMKV({ id: "ahoy.localNetwork" });

const reachedMacsSchema = z.array(z.string());

function reachedMacs(): string[] {
  const text = localNetworkStorage.getString(REACHED_MACS_KEY);
  if (text === undefined) return [];
  try {
    const parsed = reachedMacsSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function hasReachedOnLan(publicKey: string): boolean {
  return reachedMacs().includes(publicKey);
}

export function markReachedOnLan(publicKey: string): void {
  const reached = reachedMacs();
  if (reached.includes(publicKey)) return;
  const next = JSON.stringify([...reached, publicKey]);
  localNetworkStorage.set(REACHED_MACS_KEY, next);
}

export function localNetworkIntroSeen(): boolean {
  return localNetworkStorage.getBoolean(INTRO_SEEN_KEY) ?? false;
}

export function useLocalNetworkIntroSeen() {
  const [seen, setSeen] = useMMKVBoolean(INTRO_SEEN_KEY, localNetworkStorage);
  return { seen: seen ?? false, markSeen: () => setSeen(true) };
}
