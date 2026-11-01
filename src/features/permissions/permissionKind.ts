export type PermissionKind = "camera" | "mic" | "net";

export type DevicePermission = Exclude<PermissionKind, "net">;
