import { decodeBytes, encodeBytes, pairingProof } from "@getahoy/crypto";
import type { PairingQr } from "@getahoy/protocol";
import { logger } from "@/features/logging/logger";
import { pairingApi } from "../client/pairingApi";
import { phoneDescription } from "../device/phoneDescription";
import { loadDeviceKeys } from "../storage/deviceKeys";
import type { PairedMac } from "../storage/pairedMacs";
import {
  type ClaimFailure,
  claimFailure,
  claimFailureCode,
} from "./claimFailure";

export type ClaimOutcome =
  | { kind: "claimed"; mac: PairedMac }
  | { kind: "failed"; failure: ClaimFailure };

export async function claimScannedCode(qr: PairingQr): Promise<ClaimOutcome> {
  const keys = await loadDeviceKeys();
  const proof = pairingProof({
    pairingSecret: decodeBytes(qr.psk),
    phonePublicKey: keys.publicKey,
    desktopPublicKey: decodeBytes(qr.pk),
  });
  const claimed = await pairingApi.claim({
    userCode: qr.code,
    desktopPublicKey: qr.pk,
    proof: encodeBytes(proof),
    device: phoneDescription(keys),
  });
  if (claimed.code === "error") {
    if (__DEV__) logger.info("pairing.claim", claimFailureCode(claimed.error));
    return { kind: "failed", failure: claimFailure(claimed.error) };
  }
  const mac: PairedMac = {
    publicKey: qr.pk,
    displayName: qr.name,
    lastKnownAddresses: qr.lan?.hosts ?? [],
    localHost: qr.lan?.local ?? null,
    lanPort: qr.lan?.port ?? null,
    pairedAt: Date.now(),
    paused: false,
  };
  return { kind: "claimed", mac };
}
