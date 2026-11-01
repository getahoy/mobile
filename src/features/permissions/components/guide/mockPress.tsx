import { MockFade } from "./mockFade";

type MockPressProps = { pressed: boolean };

export function MockPress({ pressed }: MockPressProps) {
  return (
    <MockFade
      shown={pressed}
      speed="fast"
      className="absolute inset-0 bg-signal-mist"
    />
  );
}
