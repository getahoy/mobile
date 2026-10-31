export const MIN_ZOOM_LEVEL = 0;
export const MAX_ZOOM_LEVEL = 1;
export const ZOOM_LEVEL_STEPS = 6;
const CAMERA_ZOOM_MIN = 0;
const CAMERA_ZOOM_MAX = 1;
const EXPONENTIAL_MAX_CAMERA_ZOOM = 0.4;
const EXPONENTIAL_PINCH_GAIN = 0.25;
const LINEAR_ONE_X_CAMERA_ZOOM = 0.125;
const LINEAR_ZOOM_RANGE = 4.8;
const STEP_TOLERANCE = 0.001;
const PERCENT = 100;

export type CameraZoomCurve = "exponential" | "linear";
export type ZoomDirection = "in" | "out";

export function clampZoomLevel(level: number): number {
  "worklet";
  if (!Number.isFinite(level)) return MIN_ZOOM_LEVEL;
  return Math.min(MAX_ZOOM_LEVEL, Math.max(MIN_ZOOM_LEVEL, level));
}

function clampCameraZoom(cameraZoom: number): number {
  "worklet";
  if (!Number.isFinite(cameraZoom)) return CAMERA_ZOOM_MIN;
  return Math.min(CAMERA_ZOOM_MAX, Math.max(CAMERA_ZOOM_MIN, cameraZoom));
}

export function toCameraZoom(level: number, curve: CameraZoomCurve): number {
  "worklet";
  const safeLevel = clampZoomLevel(level);
  switch (curve) {
    case "exponential":
      return clampCameraZoom(safeLevel * EXPONENTIAL_MAX_CAMERA_ZOOM);
    case "linear":
      return clampCameraZoom(
        LINEAR_ONE_X_CAMERA_ZOOM * LINEAR_ZOOM_RANGE ** safeLevel,
      );
    default: {
      const unhandled: never = curve;
      return unhandled;
    }
  }
}

export function fromCameraZoom(
  cameraZoom: number,
  curve: CameraZoomCurve,
): number {
  "worklet";
  switch (curve) {
    case "exponential":
      return clampZoomLevel(cameraZoom / EXPONENTIAL_MAX_CAMERA_ZOOM);
    case "linear":
      return clampZoomLevel(
        Math.log(cameraZoom / LINEAR_ONE_X_CAMERA_ZOOM) /
          Math.log(LINEAR_ZOOM_RANGE),
      );
    default: {
      const unhandled: never = curve;
      return unhandled;
    }
  }
}

export function pinchZoomLevel(
  startLevel: number,
  scale: number,
  curve: CameraZoomCurve,
): number {
  "worklet";
  const startZoom = toCameraZoom(startLevel, curve);
  switch (curve) {
    case "exponential":
      return fromCameraZoom(
        startZoom + Math.log(scale) * EXPONENTIAL_PINCH_GAIN,
        curve,
      );
    case "linear":
      return fromCameraZoom(startZoom * scale, curve);
    default: {
      const unhandled: never = curve;
      return unhandled;
    }
  }
}

export function dragZoomLevel(
  startLevel: number,
  translationY: number,
  trackHeight: number,
): number {
  "worklet";
  if (trackHeight <= 0) return clampZoomLevel(startLevel);
  return clampZoomLevel(startLevel - translationY / trackHeight);
}

export function zoomLimitReached(
  level: number,
  direction: ZoomDirection,
): boolean {
  switch (direction) {
    case "in":
      return level >= MAX_ZOOM_LEVEL - STEP_TOLERANCE;
    case "out":
      return level <= MIN_ZOOM_LEVEL + STEP_TOLERANCE;
    default: {
      const unhandled: never = direction;
      return unhandled;
    }
  }
}

function nextStepIndex(position: number, direction: ZoomDirection): number {
  switch (direction) {
    case "in":
      return Math.floor(position + STEP_TOLERANCE) + 1;
    case "out":
      return Math.ceil(position - STEP_TOLERANCE) - 1;
    default: {
      const unhandled: never = direction;
      return unhandled;
    }
  }
}

export function nextZoomLevel(level: number, direction: ZoomDirection): number {
  const position = clampZoomLevel(level) * ZOOM_LEVEL_STEPS;
  return clampZoomLevel(nextStepIndex(position, direction) / ZOOM_LEVEL_STEPS);
}

export function zoomPercent(level: number): number {
  return Math.round(clampZoomLevel(level) * PERCENT);
}
