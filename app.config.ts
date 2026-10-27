import { APP_SCHEME } from "@getahoy/lib";
import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Ahoy",
  slug: "ahoy",
  version: "1.0.0",
  platforms: ["ios", "android"],
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: APP_SCHEME,
  userInterfaceStyle: "automatic",
  ios: {
    icon: "./assets/expo.icon",
    bundleIdentifier: "com.getahoy.mobile",
    infoPlist: {
      NSLocalNetworkUsageDescription:
        "Ahoy connects to your Mac on your local network.",
      NSBonjourServices: ["_ahoy._tcp"],
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
      },
    },
  },
  android: {
    package: "com.getahoy.mobile",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        image: "./assets/images/splash-icon.png",
        imageWidth: 76,
      },
    ],
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-camera",
      {
        cameraPermission:
          "Ahoy uses the camera to scan the pairing code on your Mac.",
        recordAudioAndroid: false,
        barcodeScannerEnabled: true,
      },
    ],
    [
      "expo-audio",
      {
        microphonePermission:
          "Ahoy records only while you hold the talk button.",
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
