import { logger } from "@/features/logging/logger";
import { loadDeviceKeys } from "../storage/deviceKeys";
import type { PairedMac } from "../storage/pairedMacs";
import type { StageClock } from "./connectTiming";
import { connectToMac, type MacLink } from "./connectToMac";

const UNREACHABLE_LINK: MacLink = { outcome: "unreachable" };
const LOG_CONNECT_TIMING = __DEV__;

export async function dialMac(
  mac: PairedMac,
  clock: StageClock,
): Promise<MacLink> {
  clock.mark("connect");
  const link = await loadDeviceKeys()
    .then((keys) => {
      clock.mark("keysLoaded");
      return connectToMac(mac, keys, clock.mark);
    })
    .catch(() => UNREACHABLE_LINK);
  if (link.outcome === "connected") clock.mark("connected");
  if (LOG_CONNECT_TIMING) {
    logger.info("macLink.timing", `${link.outcome}: ${clock.report()}`);
  }
  return link;
}
