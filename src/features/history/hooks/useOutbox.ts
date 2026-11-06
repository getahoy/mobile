import { useMemo } from "react";
import { useMMKVString } from "react-native-mmkv";
import type { Outbox } from "../historyOutbox";
import {
  historyStorage,
  OUTBOX_KEY,
  parseOutbox,
} from "../storage/historyStore";

export function useOutbox(): Outbox {
  const [text] = useMMKVString(OUTBOX_KEY, historyStorage);
  return useMemo(() => parseOutbox(text), [text]);
}
