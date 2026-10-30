import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const merge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
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
        "heading",
        "display",
        "wordmark",
        "welcome",
      ],
      spacing: ["orb", "welcome-orb", "signing-orb", "viewfinder", "hairline"],
      font: [
        "sans",
        "sans-medium",
        "mono",
        "fraunces",
        "fraunces-italic",
        "fraunces-light",
        "fraunces-light-italic",
      ],
      radius: ["tag", "thumb", "card", "sheet"],
      shadow: ["float", "tag"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
