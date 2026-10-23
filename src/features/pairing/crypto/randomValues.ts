import { getRandomValues } from "expo-crypto";

if (typeof globalThis.crypto?.getRandomValues !== "function") {
  Object.defineProperty(globalThis, "crypto", {
    value: { ...globalThis.crypto, getRandomValues },
    configurable: true,
  });
}
