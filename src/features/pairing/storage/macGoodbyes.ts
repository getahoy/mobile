import { parseStored } from "@getahoy/lib";
import { createMMKV } from "react-native-mmkv";
import { z } from "zod";

const macGoodbyeStorage = createMMKV({ id: "ahoy.macGoodbyes" });

const rememberedGoodbyeSchema = z.object({
  reason: z.enum(["turned_off", "quitting", "sleeping"]),
  at: z.int(),
});

export type RememberedGoodbye = z.infer<typeof rememberedGoodbyeSchema>;

export function readMacGoodbye(publicKey: string): RememberedGoodbye | null {
  const text = macGoodbyeStorage.getString(publicKey);
  return parseStored(rememberedGoodbyeSchema, text);
}

export function saveMacGoodbye(
  publicKey: string,
  memory: RememberedGoodbye | null,
): void {
  if (memory === null) {
    macGoodbyeStorage.remove(publicKey);
    return;
  }
  macGoodbyeStorage.set(publicKey, JSON.stringify(memory));
}
