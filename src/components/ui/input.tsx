import { type ComponentProps, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

type RevealLabels = { show: string; hide: string };

type InputProps = ComponentProps<typeof TextInput> & {
  shape?: "pill" | "field";
  invalid?: boolean;
  secure?: RevealLabels;
};

const shapes = { pill: "rounded-full", field: "rounded-thumb" } as const;

function borderTone(focused: boolean, invalid: boolean): string {
  if (focused) return "border-signal";
  if (invalid) return "border-flare";
  return "border-rope";
}

export function Input({
  shape = "pill",
  invalid = false,
  secure,
  secureTextEntry = false,
  editable,
  className,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const radius = shapes[shape];
  return (
    <View className={cn("-m-1 p-1", radius, focused && "bg-signal-mist")}>
      <View
        className={cn(
          "h-13 flex-row items-center border bg-paper",
          radius,
          borderTone(focused, invalid),
          editable === false && "opacity-60",
        )}
      >
        <TextInput
          className={cn(
            "h-full flex-1 px-5 font-sans text-body text-ink",
            className,
          )}
          placeholderTextColorClassName="accent-fog"
          selectionColorClassName="accent-signal"
          cursorColorClassName="accent-signal"
          aria-invalid={invalid}
          secureTextEntry={secure ? !revealed : secureTextEntry}
          {...(editable === undefined ? {} : { editable })}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />
        {secure ? (
          <Pressable
            role="button"
            accessibilityLabel={revealed ? secure.hide : secure.show}
            onPress={() => setRevealed((shown) => !shown)}
            className="mr-1 size-11 items-center justify-center rounded-full"
          >
            <Icon
              name={revealed ? "eyeSlash" : "eye"}
              tintColorClassName="accent-driftwood"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
