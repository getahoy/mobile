import { type AndroidSymbol, type SFSymbol, SymbolView } from "expo-symbols";
import { withUniwind } from "uniwind";

const symbols = {
  mic: { ios: "mic.fill", android: "mic" },
  settings: { ios: "gearshape", android: "settings" },
  more: { ios: "ellipsis", android: "more_horiz" },
  check: { ios: "checkmark", android: "check" },
  checkCircle: { ios: "checkmark.circle.fill", android: "check_circle" },
  close: { ios: "xmark", android: "close" },
  torchOn: { ios: "flashlight.on.fill", android: "flashlight_on" },
  torchOff: { ios: "flashlight.off.fill", android: "flashlight_off" },
  eye: { ios: "eye", android: "visibility" },
  eyeSlash: { ios: "eye.slash", android: "visibility_off" },
  chevronRight: { ios: "chevron.right", android: "chevron_right" },
  chevronLeft: { ios: "chevron.left", android: "chevron_left" },
  chevronDown: { ios: "chevron.down", android: "expand_more" },
  mac: { ios: "laptopcomputer", android: "laptop_mac" },
  account: { ios: "person.crop.circle", android: "account_circle" },
} as const satisfies Record<string, { ios: SFSymbol; android: AndroidSymbol }>;

export type IconName = keyof typeof symbols;

const ICON_SIZE = { sm: 16, md: 20, lg: 24, xl: 32 } as const;

const StyledSymbol = withUniwind(SymbolView);

type IconProps = {
  name: IconName;
  size?: keyof typeof ICON_SIZE;
  tintColorClassName?: string;
  className?: string;
};

export function Icon({
  name,
  size = "md",
  tintColorClassName = "accent-ink",
  className,
}: IconProps) {
  const { ios, android } = symbols[name];
  return (
    <StyledSymbol
      aria-hidden
      name={{ ios, android, web: android }}
      size={ICON_SIZE[size]}
      tintColorClassName={tintColorClassName}
      {...(className ? { className } : {})}
    />
  );
}
