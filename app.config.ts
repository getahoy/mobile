import { execFileSync } from "node:child_process";
import { APP_SCHEME } from "@getahoy/lib";
import type { ExpoConfig } from "expo/config";
import { systemPrompts } from "./src/features/permissions/copy/systemPrompts.ts";

function gitCommit(): string {
  try {
    const args = ["rev-parse", "--short", "HEAD"];
    return execFileSync("git", args, { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

const SAILCLOTH = "#f4f2ed";
const NIGHT = "#121110";
const WORDMARK_WIDTH = 120;

const FONT_FILES = [
  "FrauncesAhoy-Light",
  "FrauncesAhoy-LightItalic",
  "FrauncesAhoy-Regular",
  "FrauncesAhoy-Italic",
  "Inter-Regular",
  "Inter-Medium",
  "GeistMono-Medium",
].map((name) => `./assets/fonts/${name}.ttf`);

const config: ExpoConfig = {
  extra: { gitCommit: gitCommit() },
  name: "Ahoy",
  backgroundColor: SAILCLOTH,
  slug: "ahoy",
  version: "1.0.0",
  platforms: ["ios", "android"],
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: APP_SCHEME,
  userInterfaceStyle: "automatic",
  ios: {
    bundleIdentifier: "com.getahoy.mobile",
    infoPlist: {
      NSLocalNetworkUsageDescription: systemPrompts.net,
      NSBonjourServices: ["_ahoy._tcp"],
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
      },
    },
  },
  android: {
    package: "com.getahoy.mobile",
    adaptiveIcon: {
      backgroundColor: SAILCLOTH,
      foregroundImage: "./assets/images/android-icon-foreground.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: SAILCLOTH,
        image: "./assets/images/splashWordmark@3x.png",
        imageWidth: WORDMARK_WIDTH,
        dark: {
          backgroundColor: NIGHT,
          image: "./assets/images/splashWordmarkDark@3x.png",
        },
      },
    ],
    ["expo-font", { fonts: FONT_FILES }],
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-camera",
      {
        cameraPermission: systemPrompts.camera,
        recordAudioAndroid: false,
        barcodeScannerEnabled: true,
      },
    ],
    [
      "expo-audio",
      {
        microphonePermission: systemPrompts.mic,
        recordAudioAndroid: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
