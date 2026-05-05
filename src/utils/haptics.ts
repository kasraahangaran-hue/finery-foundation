/**
 * Haptics — light/medium/heavy/success/warning/error triggers.
 * Uses navigator.vibrate as a fallback. When the native iOS shell injects
 * a `window.WashmenBridge.haptic(level)`, that takes precedence so the
 * native UIImpactFeedbackGenerator can be used.
 *
 * NOTE: Bridge global is `WashmenBridge` (not `FineryBridge`) by design —
 * The Finery web bundle ships inside the same iOS/Android native shell as
 * the Washmen consumer app. Keeping the bridge name consistent across all
 * web bundles means the native team writes the bridge once.
 */

export type HapticLevel = "light" | "medium" | "heavy" | "success" | "warning" | "error";

declare global {
  interface Window {
    WashmenBridge?: {
      haptic?: (level: HapticLevel) => void;
      openSheet?: (sheetName: string, currentValue?: unknown) => void;
      onSheetResult?: (sheetName: string, callback: (result: unknown) => void) => () => void;
      onBack?: (callback: () => boolean) => () => void;
      dismiss?: () => void;
      entryRoute?: string;
    };
  }
}

const VIBRATE_MAP: Record<HapticLevel, number | number[]> = {
  light: 8,
  medium: 14,
  heavy: 22,
  success: [10, 40, 10],
  warning: [12, 60, 12],
  error: [20, 60, 20, 60, 20],
};

function trigger(level: HapticLevel) {
  try {
    if (typeof window !== "undefined" && window.WashmenBridge?.haptic) {
      window.WashmenBridge.haptic(level);
      return;
    }
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(VIBRATE_MAP[level]);
    }
  } catch {
    // no-op
  }
}

export const haptics = {
  light: () => trigger("light"),
  medium: () => trigger("medium"),
  heavy: () => trigger("heavy"),
  success: () => trigger("success"),
  warning: () => trigger("warning"),
  error: () => trigger("error"),
};