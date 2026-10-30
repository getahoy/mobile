import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, createContext, useContext } from "react";
import { Text as NativeText, type Role } from "react-native";
import { cn } from "@/lib/cn";

const DISPLAY_FONT_SCALE_LIMIT = 1.3;

const textVariants = cva("text-ink", {
  variants: {
    variant: {
      display: "font-fraunces-light text-display",
      heading: "font-fraunces-light text-heading",
      title: "font-fraunces text-title",
      heard: "font-fraunces-italic text-heard text-driftwood",
      body: "font-sans text-body",
      bodySmall: "font-sans text-callout",
      footnote: "font-sans text-footnote",
      caption: "font-sans text-caption text-driftwood",
      eyebrow: "font-mono text-eyebrow uppercase text-driftwood",
    },
  },
  defaultVariants: { variant: "body" },
});

type TextVariant = NonNullable<VariantProps<typeof textVariants>["variant"]>;

const DISPLAY_SIZES: readonly TextVariant[] = [
  "display",
  "heading",
  "title",
  "heard",
];
const HEADINGS: readonly TextVariant[] = ["display", "heading", "title"];

export const TextClassContext = createContext<string | undefined>(undefined);

type TextProps = ComponentProps<typeof NativeText> & {
  variant?: TextVariant;
};

export function Text({ className, variant = "body", ...props }: TextProps) {
  const inherited = useContext(TextClassContext);
  const role: Role | undefined = HEADINGS.includes(variant)
    ? "heading"
    : undefined;
  const scaleLimit = DISPLAY_SIZES.includes(variant)
    ? DISPLAY_FONT_SCALE_LIMIT
    : undefined;
  return (
    <NativeText
      className={cn(textVariants({ variant }), inherited, className)}
      {...(role ? { role } : {})}
      {...(scaleLimit ? { maxFontSizeMultiplier: scaleLimit } : {})}
      {...props}
    />
  );
}
