import type { ReactNode } from "react";
import { settingsMockCopy } from "../../copy/settingsMockCopy";
import {
  androidFrame,
  type FingerPoint,
  type GuideTarget,
  iosFrame,
} from "../../guideTimeline";
import { AndroidSettingsMock } from "./androidSettingsMock";
import { IosSettingsMock } from "./iosSettingsMock";

export type GuideScene = {
  label: string;
  steps: readonly string[];
  activeStep: number;
  finger: FingerPoint;
  mock: ReactNode;
};

export function guideScene(target: GuideTarget, frame: number): GuideScene {
  if (target.look === "ios") {
    const ios = iosFrame(target.kind, frame);
    return {
      label: settingsMockCopy.iosAlt(target.kind),
      steps: settingsMockCopy.iosSteps(target.kind),
      activeStep: ios.activeStep,
      finger: ios.finger,
      mock: <IosSettingsMock frame={ios} />,
    };
  }
  const android = androidFrame(frame);
  return {
    label: settingsMockCopy.androidAlt(target.kind),
    steps: settingsMockCopy.androidSteps(target.kind),
    activeStep: android.activeStep,
    finger: android.finger,
    mock: <AndroidSettingsMock kind={target.kind} frame={android} />,
  };
}
