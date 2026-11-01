import type { AndroidFrame } from "../../guideTimeline";
import type { DevicePermission } from "../../permissionKind";
import { AndroidAppInfoFrame } from "./androidAppInfoFrame";
import { AndroidChoiceFrame } from "./androidChoiceFrame";
import { AndroidPermissionsFrame } from "./androidPermissionsFrame";
import { MockFade } from "./mockFade";

const layer = "absolute inset-0";

type AndroidSettingsMockProps = { kind: DevicePermission; frame: AndroidFrame };

export function AndroidSettingsMock({ kind, frame }: AndroidSettingsMockProps) {
  return (
    <>
      <MockFade
        shown={frame.screen === "appInfo"}
        speed="base"
        className={layer}
      >
        <AndroidAppInfoFrame kind={kind} pressed={frame.permissionsPressed} />
      </MockFade>
      <MockFade
        shown={frame.screen === "permissions"}
        speed="base"
        className={layer}
      >
        <AndroidPermissionsFrame kind={kind} pressed={frame.targetPressed} />
      </MockFade>
      <MockFade
        shown={frame.screen === "choice"}
        speed="base"
        className={layer}
      >
        <AndroidChoiceFrame kind={kind} frame={frame} />
      </MockFade>
    </>
  );
}
