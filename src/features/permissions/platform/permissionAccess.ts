import { type PermissionResponse, PermissionStatus } from "expo";
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from "expo-audio";
import { Camera } from "expo-camera";
import type { DevicePermission } from "../permissionKind";
import { type PermissionStage, permissionStage } from "../permissionStage";

type PermissionAccess = {
  read: () => Promise<PermissionStage>;
  request: () => Promise<PermissionStage>;
};

function stageOf(response: PermissionResponse): PermissionStage {
  return permissionStage({
    granted: response.granted,
    asked: response.status !== PermissionStatus.UNDETERMINED,
    canAskAgain: response.canAskAgain,
  });
}

export const permissionAccess: Record<DevicePermission, PermissionAccess> = {
  camera: {
    read: () => Camera.getCameraPermissionsAsync().then(stageOf),
    request: () => Camera.requestCameraPermissionsAsync().then(stageOf),
  },
  mic: {
    read: () => getRecordingPermissionsAsync().then(stageOf),
    request: () => requestRecordingPermissionsAsync().then(stageOf),
  },
};
