export const APPEARANCES = ["system", "light", "dark"] as const;

export type Appearance = (typeof APPEARANCES)[number];
export type ResolvedTheme = "light" | "dark";
