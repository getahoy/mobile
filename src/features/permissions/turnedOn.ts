import { router } from "expo-router";
import { z } from "zod";

export const turnedOnSchema = z.enum(["mic", "net"]);

export type TurnedOn = z.infer<typeof turnedOnSchema>;

export function backHomeTurnedOn(kind: TurnedOn): void {
  const params = { turnedOn: kind, at: String(Date.now()) };
  router.dismissTo({ pathname: "/", params });
}
