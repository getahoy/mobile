import { decodeBytes, encodeBytes, pairingProof } from "@getahoy/crypto";
import { requestErrorMessage } from "@getahoy/lib";
import { type PairingQr, pairingQrSchema } from "@getahoy/protocol";
import { claimPairing } from "../client/pairingApi";
import { pairingCopy } from "../copy/pairingCopy";
import { phoneDescription } from "../device/phoneDescription";
import { loadDeviceKeys } from "../storage/deviceKeys";
import type { PairedMac } from "../storage/pairedMacs";

const MS_PER_SECOND = 1000;

export type ClaimOutcome =
  | { kind: "claimed"; mac: PairedMac }
  | { kind: "failed"; message: string };

function readQr(scanned: string): PairingQr | null {
  try {
    const parsed = pairingQrSchema.safeParse(JSON.parse(scanned));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function claimScannedCode(scanned: string): Promise<ClaimOutcome> {
  const qr = readQr(scanned);
  if (!qr) return { kind: "failed", message: pairingCopy["scan.notAhoy"] };
  if (qr.exp * MS_PER_SECOND <= Date.now()) {
    return { kind: "failed", message: pairingCopy["scan.expired"] };
  }
  const keys = await loadDeviceKeys();
  const proof = pairingProof({
    pairingSecret: decodeBytes(qr.psk),
    phonePublicKey: keys.publicKey,
    desktopPublicKey: decodeBytes(qr.pk),
  });
  const claimed = await claimPairing({
    userCode: qr.code,
    desktopPublicKey: qr.pk,
    proof: encodeBytes(proof),
    device: phoneDescription(keys),
  });
  if (claimed.code === "error") {
    return { kind: "failed", message: requestErrorMessage(claimed.error) };
  }
  const mac: PairedMac = {
    publicKey: qr.pk,
    displayName: qr.name,
    lastKnownAddresses: qr.lan?.hosts ?? [],
    lanPort: qr.lan?.port ?? null,
    pairedAt: Date.now(),
    paused: false,
    ended: null,
  };
  return { kind: "claimed", mac };
}
