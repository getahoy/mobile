import { useCSSVariable } from "uniwind";

export type OrbTone = "listen" | "speak";

const STOP_POSITIONS = ["0%", "38%", "70%"] as const;
const FULLY_TRANSPARENT_ALPHA = "00";

export function useOrbGradient(tone: OrbTone): string {
  const stops = useCSSVariable([
    `--color-${tone}-core`,
    `--color-${tone}-mid`,
    `--color-${tone}-edge`,
  ]);
  const colors = stops.map(String);
  const placed = colors.map(
    (color, index) => `${color} ${STOP_POSITIONS[index]}`,
  );
  const fadedEdge = `${colors[colors.length - 1]}${FULLY_TRANSPARENT_ALPHA} 100%`;
  return `radial-gradient(closest-side, ${[...placed, fadedEdge].join(", ")})`;
}
