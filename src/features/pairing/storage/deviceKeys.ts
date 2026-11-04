import {
  decodeBytes,
  encodeBytes,
  generateKeyPair,
  type KeyPair,
} from "@getahoy/crypto";
import { bytes32Schema } from "@getahoy/protocol";
import { z } from "zod";
import { pairingEntry, pairingKeychain } from "./pairingKeychain";

const storedKeysSchema = z.object({
  publicKey: bytes32Schema,
  secretKey: bytes32Schema,
});

function parseStored(text: string | null) {
  if (text === null) return null;
  try {
    const parsed = storedKeysSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

// Every reconnect needs the keys; reading SecureStore each time slows the dial.
let loaded: Promise<KeyPair> | null = null;

export async function clearDeviceKeys(): Promise<void> {
  loaded = null;
  await pairingKeychain.remove(pairingEntry.deviceKeys);
}

export function loadDeviceKeys(): Promise<KeyPair> {
  loaded ??= readOrCreateKeys().catch((error: unknown) => {
    loaded = null;
    throw error;
  });
  return loaded;
}

async function readOrCreateKeys(): Promise<KeyPair> {
  const stored = parseStored(
    await pairingKeychain.read(pairingEntry.deviceKeys),
  );
  if (stored) {
    return {
      publicKey: decodeBytes(stored.publicKey),
      secretKey: decodeBytes(stored.secretKey),
    };
  }
  const keys = generateKeyPair();
  const encoded = {
    publicKey: encodeBytes(keys.publicKey),
    secretKey: encodeBytes(keys.secretKey),
  };
  await pairingKeychain.write(pairingEntry.deviceKeys, JSON.stringify(encoded));
  return keys;
}
