import { type PairingQr, pairingQrSchema } from "@getahoy/protocol";

const MS_PER_SECOND = 1000;

type ScannedCode =
  | { kind: "read"; qr: PairingQr }
  | { kind: "notAhoy" }
  | { kind: "expired" };

function readQr(scanned: string): PairingQr | null {
  try {
    const parsed = pairingQrSchema.safeParse(JSON.parse(scanned));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function qrExpired(qr: PairingQr, now: number): boolean {
  return qr.exp * MS_PER_SECOND <= now;
}

export function readScannedCode(scanned: string, now: number): ScannedCode {
  const qr = readQr(scanned);
  if (!qr) return { kind: "notAhoy" };
  if (qrExpired(qr, now)) return { kind: "expired" };
  return { kind: "read", qr };
}
