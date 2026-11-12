import {
  type PairingQr,
  pairingQrExpired,
  readPairingQr,
} from "@getahoy/protocol";

type ScannedCode =
  | { kind: "read"; qr: PairingQr }
  | { kind: "notAhoy" }
  | { kind: "expired" };

export function readScannedCode(scanned: string, now: number): ScannedCode {
  const qr = readPairingQr(scanned);
  if (!qr) return { kind: "notAhoy" };
  if (pairingQrExpired(qr, now)) return { kind: "expired" };
  return { kind: "read", qr };
}
