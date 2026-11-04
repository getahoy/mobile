const MAGNIFICATION_RANGE = 5;
const MARK_MAGNIFICATIONS = [1, 2, 5] as const;
const REARM_DISTANCE = 0.05;
const MARK_TOLERANCE = 0.001;

export function magnificationLevel(magnification: number): number {
  return Math.log(magnification) / Math.log(MAGNIFICATION_RANGE);
}

const MARK_LEVELS = MARK_MAGNIFICATIONS.map(magnificationLevel);

export const FIRST_MARK = magnificationLevel(1);

type ZoomMarkStep = { crossed: boolean; lastMark: number | null };

function crossedMark(
  lastMark: number | null,
  previous: number,
  next: number,
): number | null {
  const low = Math.min(previous, next) - MARK_TOLERANCE;
  const high = Math.max(previous, next) + MARK_TOLERANCE;
  const crossed = MARK_LEVELS.filter(
    (mark) => mark !== lastMark && mark >= low && mark <= high,
  );
  const distance = (mark: number) => Math.abs(mark - next);
  return crossed.reduce<number | null>(
    (closest, mark) =>
      closest === null || distance(mark) < distance(closest) ? mark : closest,
    null,
  );
}

export function zoomMarkStep(
  lastMark: number | null,
  previous: number,
  next: number,
): ZoomMarkStep {
  const mark = crossedMark(lastMark, previous, next);
  if (mark !== null) return { crossed: true, lastMark: mark };
  const left = lastMark !== null && Math.abs(next - lastMark) > REARM_DISTANCE;
  return { crossed: false, lastMark: left ? null : lastMark };
}
