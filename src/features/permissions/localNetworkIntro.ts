import { permissionPlatform } from "./platform/permissionPlatform";
import { localNetworkIntroSeen } from "./storage/localNetworkMemory";

export function localNetworkIntroPending(): boolean {
  return permissionPlatform.asksForLocalNetwork && !localNetworkIntroSeen();
}
