import {
  decodeBytes,
  encodeBytes,
  generateKeyPair,
  type KeyPair,
} from "@getahoy/crypto";
import { bytes32Schema } from "@getahoy/protocol";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";

const DEVICE_KEYS_ENTRY = "ahoy.device.keys";

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

export async function clearDeviceKeys(): Promise<void> {
  await SecureStore.deleteItemAsync(DEVICE_KEYS_ENTRY);
}

export async function loadDeviceKeys(): Promise<KeyPair> {
  const stored = parseStored(await SecureStore.getItemAsync(DEVICE_KEYS_ENTRY));
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
  await SecureStore.setItemAsync(DEVICE_KEYS_ENTRY, JSON.stringify(encoded));
  return keys;
}
