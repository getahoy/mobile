export type ConnectStage =
  | "foreground"
  | "connect"
  | "keysLoaded"
  | "socketOpen"
  | "firstMessageBuilt"
  | "replyReceived"
  | "replyRead"
  | "connected";

export type MarkStage = (stage: ConnectStage) => void;

export type StageClock = { mark: MarkStage; report: () => string };

export function createStageClock(now: () => number): StageClock {
  const marks: { stage: ConnectStage; at: number }[] = [];
  return {
    mark: (stage) => marks.push({ stage, at: now() }),
    report: () => {
      const first = marks[0]?.at ?? 0;
      const steps = marks.map(({ stage, at }, index) => {
        const previous = marks[index - 1]?.at ?? at;
        return `${stage} +${at - previous}ms`;
      });
      const last = marks.at(-1)?.at ?? first;
      return `${steps.join(", ")} (total ${last - first}ms)`;
    },
  };
}
