import {
  decodeBytes,
  encodeBytes,
  generateKeyPair,
  type KeyPair,
} from "@getahoy/crypto";
import { parseStored } from "@getahoy/lib";
import { bytes32Schema } from "@getahoy/protocol";
import { z } from "zod";
import { pairingEntry, pairingKeychain } from "./pairingKeychain";

const storedKeysSchema = z.object({
  publicKey: bytes32Schema,
  secretKey: bytes32Schema,
});

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
  const text = await pairingKeychain.read(pairingEntry.deviceKeys);
  const stored = parseStored(storedKeysSchema, text);
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
