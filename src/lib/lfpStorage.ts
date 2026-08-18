export interface LfpSettings {
  enabled: boolean;
  activeDeviceFrame: "none" | "pixel" | "iphone" | "foldable" | "compact";
  orientation: "portrait" | "landscape";
  cellularNetwork: "5G" | "4G-LTE" | "Tor-Mesh" | "Offline";
  batteryLevel: number;
  isCharging: boolean;
  touchHaptics: boolean;
  gestureNav: boolean;
  screenDpiScale: number; // 0.85, 1.0, 1.15
  autoDetectViewport: boolean;
  emergencySosCall: boolean;
}

export const DEFAULT_LFP_SETTINGS: LfpSettings = {
  enabled: true,
  activeDeviceFrame: "iphone",
  orientation: "portrait",
  cellularNetwork: "5G",
  batteryLevel: 94,
  isCharging: true,
  touchHaptics: true,
  gestureNav: true,
  screenDpiScale: 1.0,
  autoDetectViewport: true,
  emergencySosCall: false,
};
