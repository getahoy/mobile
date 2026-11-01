import { encodeBytes } from "@getahoy/crypto";
import { listPairingLinks } from "../client/pairingApi";
import { loadDeviceKeys } from "../storage/deviceKeys";
import { clearEndedNotice } from "../storage/endedNotice";
import { type PairedMac, savePairedMac } from "../storage/pairedMacs";

const POLL_INTERVAL_MS = 1000;
const FINISH_TIMEOUT_MS = 30_000;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function linkIsActive(device: string, macKey: string): Promise<boolean> {
  const listed = await listPairingLinks(device);
  if (listed.code === "error") return false;
  return listed.data.links.some(
    (link) => link.peerPublicKey === macKey && link.active,
  );
}

export async function finishPairing(mac: PairedMac): Promise<boolean> {
  const keys = await loadDeviceKeys();
  const device = encodeBytes(keys.publicKey);
  const deadline = Date.now() + FINISH_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await linkIsActive(device, mac.publicKey)) {
      await savePairedMac({ ...mac, pairedAt: Date.now() });
      clearEndedNotice();
      return true;
    }
    await wait(POLL_INTERVAL_MS);
  }
  return false;
}
