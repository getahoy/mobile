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
  if (text === undefined) return null;
  try {
    const parsed = rememberedGoodbyeSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
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
