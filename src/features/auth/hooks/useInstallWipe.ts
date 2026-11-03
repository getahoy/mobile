import { useEffect, useState } from "react";
import { logger } from "@/features/logging/logger";
import { wipeAuthStorage } from "../client/wipeAuthStorage";
import { runInstallWipe } from "../installWipe";
import { markInstallSeen, readInstallSeen } from "../storage/installMarker";

export function useInstallWipe(): boolean {
  const [settled, setSettled] = useState(readInstallSeen);

  useEffect(() => {
    if (settled) return;
    runInstallWipe({
      seen: readInstallSeen,
      wipe: wipeAuthStorage,
      markSeen: markInstallSeen,
    })
      .catch((error: unknown) =>
        logger.error("auth.install", "wipe failed", error),
      )
      .finally(() => setSettled(true));
  }, [settled]);

  return settled;
}
