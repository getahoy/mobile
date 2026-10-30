import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable } from "react-native";
import { cn } from "@/lib/cn";
import { useSpinnerVisible } from "@/lib/useSpinnerVisible";
import { TextClassContext } from "./text";

const buttonVariants = cva(
  "flex-row items-center justify-center gap-2 rounded-full",
  {
    variants: {
      variant: {
        primary: "bg-ink active:opacity-80",
        secondary: "border border-rope bg-paper active:bg-linen",
        outline: "border border-rope active:bg-linen",
        ghost: "active:bg-linen",
        destructive: "bg-flare active:opacity-80",
      },
      size: {
        md: "h-13 px-6",
        sm: "h-10 px-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

const labelVariants = cva("font-sans-medium", {
  variants: {
    variant: {
      primary: "text-on-ink",
      secondary: "text-ink",
      outline: "text-ink",
      ghost: "text-ink",
      destructive: "text-on-flare",
    },
    size: {
      md: "text-body",
      sm: "text-callout",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

const spinnerTint = {
  primary: "accent-on-ink",
  secondary: "accent-ink",
  outline: "accent-ink",
  ghost: "accent-ink",
  destructive: "accent-on-flare",
} as const;

type ButtonProps = ComponentProps<typeof Pressable> &
  VariantProps<typeof buttonVariants> & { loading?: boolean };

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const spinning = useSpinnerVisible(loading);
  const blocked = disabled === true || loading;
  const idleDisabled = disabled === true && !loading;
  const label = labelVariants({ variant, size });
  return (
    <TextClassContext.Provider value={cn(label, idleDisabled && "text-fog")}>
      <Pressable
        role="button"
        disabled={blocked}
        accessibilityState={{ disabled: blocked, busy: loading }}
        className={cn(
          buttonVariants({ variant, size }),
          idleDisabled && "border-transparent bg-linen",
          className,
        )}
        {...props}
      >
        {(state) => (
          <>
            {spinning ? (
              <ActivityIndicator
                colorClassName={spinnerTint[variant ?? "primary"]}
              />
            ) : null}
            {typeof children === "function" ? children(state) : children}
          </>
        )}
      </Pressable>
    </TextClassContext.Provider>
  );
}
