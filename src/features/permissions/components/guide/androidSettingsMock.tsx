import type { AndroidFrame } from "../../guideTimeline";
import type { PermissionKind } from "../../permissionKind";
import { AndroidAppInfoFrame } from "./androidAppInfoFrame";
import { AndroidChoiceFrame } from "./androidChoiceFrame";
import { AndroidPermissionsFrame } from "./androidPermissionsFrame";
import { MockFrame } from "./mockFrame";

type AndroidSettingsMockProps = { kind: PermissionKind; frame: AndroidFrame };

export function AndroidSettingsMock({ kind, frame }: AndroidSettingsMockProps) {
  return (
    <>
      <MockFrame shown={frame.screen === "appInfo"}>
        <AndroidAppInfoFrame kind={kind} pressed={frame.permissionsPressed} />
      </MockFrame>
      <MockFrame shown={frame.screen === "permissions"}>
        <AndroidPermissionsFrame kind={kind} pressed={frame.targetPressed} />
      </MockFrame>
      <MockFrame shown={frame.screen === "choice"}>
        <AndroidChoiceFrame kind={kind} frame={frame} />
      </MockFrame>
    </>
  );
}
