import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Linking } from "react-native";
import type { DevicePermission } from "../permissionKind";
import type { PermissionStage } from "../permissionStage";
import { permissionAccess } from "../platform/permissionAccess";
import {
  forgetSettingsReturn,
  rememberSettingsReturn,
  type SettingsReturn,
} from "../storage/settingsReturn";

export type GateScreen = "checking" | PermissionStage | "restricted" | "busy";

export type GrantedVia = "already" | "popup" | "settings";

type PermissionGateOptions = {
  returnTo: SettingsReturn;
  resumed: boolean;
  onGranted: (via: GrantedVia) => void;
};

export type PermissionGate = ReturnType<typeof usePermissionGate>;

export function usePermissionGate(
  kind: DevicePermission,
  options: PermissionGateOptions,
) {
  const access = permissionAccess[kind];
  const [screen, setScreen] = useState<GateScreen>("checking");
  const shown = useRef<GateScreen>("checking");
  const inSettings = useRef(options.resumed);
  const latest = useRef(options);

  useEffect(() => {
    latest.current = options;
  });

  const show = useCallback((next: GateScreen, via: GrantedVia) => {
    const was = shown.current;
    shown.current = next;
    setScreen(next);
    if (next === "granted" && was !== "granted") latest.current.onGranted(via);
  }, []);

  const check = useCallback(() => {
    const via = inSettings.current ? "settings" : "already";
    inSettings.current = false;
    void access.read().then(
      (stage) => show(stage, via),
      () => show("busy", via),
    );
  }, [access, show]);

  useEffect(() => check(), [check]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState !== "active") return;
      forgetSettingsReturn();
      if (shown.current !== "busy") check();
    });
    return () => subscription.remove();
  }, [check]);

  const ask = () =>
    void access.request().then(
      (stage) => show(stage, "popup"),
      () => show("busy", "popup"),
    );

  const openSettings = () => {
    inSettings.current = true;
    rememberSettingsReturn(latest.current.returnTo);
    void Linking.openSettings();
  };

  const fail = () => show("busy", "already");

  return { screen, ask, openSettings, fail, retry: check };
}
