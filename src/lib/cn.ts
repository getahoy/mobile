import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const merge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "mock-label",
        "mock-caption",
        "mock-title",
        "eyebrow",
        "caption",
        "footnote",
        "body-sm",
        "callout",
        "numeral",
        "body",
        "body-lg",
        "heard",
        "title",
        "headline",
        "heading",
        "display",
        "wordmark",
        "welcome",
      ],
      spacing: [
        "orb",
        "welcome-orb",
        "signing-orb",
        "viewfinder",
        "hairline",
        "guide",
        "finger",
      ],
      font: [
        "sans",
        "sans-medium",
        "mono",
        "fraunces",
        "fraunces-italic",
        "fraunces-light",
        "fraunces-light-italic",
      ],
      radius: ["tag", "thumb", "mock", "card", "sheet"],
      shadow: ["float", "tag", "knob"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
