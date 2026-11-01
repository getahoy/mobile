import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { permissionAccess } from "../platform/permissionAccess";
import { takeSettingsReturn } from "../storage/settingsReturn";
import { type TurnedOn, turnedOnSchema } from "../turnedOn";

type Notice = { kind: TurnedOn; key: string };

const AFTER_RESTART = "afterRestart";

// iOS restarts the app after a privacy change, so the return from Settings
// is read from storage at launch.
export type TurnedOnNotice = ReturnType<typeof useTurnedOnNotice>;

export function useTurnedOnNotice() {
  const { turnedOn, at } = useLocalSearchParams<{
    turnedOn?: string;
    at?: string;
  }>();
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const back = takeSettingsReturn();
    if (back === "resumePairing") {
      router.push({ pathname: "/pair", params: { resumed: "1" } });
    }
    if (back !== "resumeTalk") return;
    void permissionAccess.mic.read().then(
      (stage) => {
        if (stage === "granted") setNotice({ kind: "mic", key: AFTER_RESTART });
      },
      () => undefined,
    );
  }, []);

  useEffect(() => {
    const parsed = turnedOnSchema.safeParse(turnedOn);
    if (parsed.success) setNotice({ kind: parsed.data, key: at ?? "" });
  }, [turnedOn, at]);

  return { notice, clear: () => setNotice(null) };
}
