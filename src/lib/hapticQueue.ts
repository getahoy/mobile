import {
  HAPTIC_EVENTS,
  type HapticEvent,
  type HapticFeel,
} from "./hapticEvents.ts";

export const COALESCE_MS = 30;
export const TAP_GAP_MS = 150;
export const PATTERN_GAP_MS = 400;
const RANKS_PER_FEEL = 10;

const FEEL_PRIORITY: Record<HapticFeel, number> = {
  selection: 0,
  impactSoft: 1,
  impactLight: 1,
  impactMedium: 1,
  success: 2,
  warning: 3,
  error: 4,
};

const RANK_WITHIN_FEEL: Partial<Record<HapticEvent, number>> = {
  pairingEnded: 1,
};

const PATTERN_FEELS: readonly HapticFeel[] = ["success", "warning", "error"];

export type HapticQueue = {
  pending: HapticEvent | null;
  playAt: number;
  gapEndsAt: number;
  gapPriority: number;
};

export const IDLE_QUEUE: HapticQueue = {
  pending: null,
  playAt: 0,
  gapEndsAt: Number.NEGATIVE_INFINITY,
  gapPriority: -1,
};

function priority(event: HapticEvent): number {
  const feel = FEEL_PRIORITY[HAPTIC_EVENTS[event]];
  return feel * RANKS_PER_FEEL + (RANK_WITHIN_FEEL[event] ?? 0);
}

function gapAfter(event: HapticEvent): number {
  const patterned = PATTERN_FEELS.includes(HAPTIC_EVENTS[event]);
  return patterned ? PATTERN_GAP_MS : TAP_GAP_MS;
}

export function offerHaptic(
  queue: HapticQueue,
  event: HapticEvent,
  now: number,
): HapticQueue {
  const inGap = now < queue.gapEndsAt;
  if (inGap && priority(event) <= queue.gapPriority) return queue;
  const { pending } = queue;
  if (pending) {
    const higher = priority(event) > priority(pending) ? event : pending;
    return { ...queue, pending: higher };
  }
  const playAt = inGap ? queue.gapEndsAt : now + COALESCE_MS;
  return { ...queue, pending: event, playAt };
}

export function playDue(
  queue: HapticQueue,
  now: number,
): { queue: HapticQueue; play: HapticEvent | null } {
  const { pending } = queue;
  if (!pending || now < queue.playAt) return { queue, play: null };
  const gapEndsAt = now + gapAfter(pending);
  const gapPriority = priority(pending);
  return {
    queue: { ...queue, pending: null, gapEndsAt, gapPriority },
    play: pending,
  };
}
