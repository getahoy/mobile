import { createMMKV } from "react-native-mmkv";

const NUDGE_SEEN_KEY = "talk.tryNudgeSeen";

const talkStorage = createMMKV({ id: "ahoy.talk" });

export function tryNudgeSeen(): boolean {
  return talkStorage.getBoolean(NUDGE_SEEN_KEY) ?? false;
}

export function markTryNudgeSeen(): void {
  talkStorage.set(NUDGE_SEEN_KEY, true);
}
