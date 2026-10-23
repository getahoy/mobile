import { encodeBytes, type KeyPair } from "@getahoy/crypto";
import {
  type DeviceDescription,
  type Hello,
  PROTOCOL_VERSION,
  platformSchema,
} from "@getahoy/protocol";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

const FALLBACK_PHONE_NAME = "Phone";
const UNKNOWN_VERSION = "0.0.0";

export function phoneHello(): Hello {
  return {
    protocolVersion: PROTOCOL_VERSION,
    platform: platformSchema.parse(Platform.OS),
    appVersion: Constants.expoConfig?.version ?? UNKNOWN_VERSION,
    capabilities: [],
  };
}

export function phoneDescription(keys: KeyPair): DeviceDescription {
  return {
    ...phoneHello(),
    publicKey: encodeBytes(keys.publicKey),
    displayName: Device.deviceName ?? Device.modelName ?? FALLBACK_PHONE_NAME,
    platformVersion: String(Platform.Version),
  };
}
