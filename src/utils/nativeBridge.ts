// HANDOFF: This is a STUB. Every method here must be wired to the native
// iOS/Android bridge before shipping. The web layer calls these to:
//   - openSheet(name, value)  → request the native app to display a native
//                                bottom sheet (payment_method, etc.) with
//                                the given current value.
//   - onSheetResult(name, cb) → subscribe to the user's selection from a
//                                native sheet. Returns an unsubscribe function.
// The expected native side is a `window.WashmenBridge` global injected by
// the iOS/Android WebView on app load with matching method signatures.
// Confirm the contract with the iOS/Android team before wiring.
// Until wired, openSheet is a no-op (logs to console) and onSheetResult
// never fires — so any flow that requires native-sheet interaction
// won't work end-to-end in a real app build.
//
// NOTE: Bridge global is `WashmenBridge` (not `FineryBridge`) by design —
// the Finery web bundle ships inside the same iOS/Android native shell as
// the Washmen consumer app. Same shell, same bridge global.

export type NativeSheetName =
  | "address"        // -> { address, apartment }
  // pickup_schedule and payment_method may move from native to web during
  // the Finery build (laundry's PickupSchedulingSheet moved to web on
  // 2026-04-28). Bridge stubs kept either way — cheap to keep, expensive
  // to re-add if requirements flip.
  | "pickup_schedule" // -> { date, slot }
  | "payment_method"; // -> { method, last4 }

type Listener = (result: unknown) => void;
const listeners = new Map<NativeSheetName, Set<Listener>>();

export const nativeBridge = {
  openSheet(sheetName: NativeSheetName, currentValue?: unknown) {
    console.log("[NativeBridge stub] openSheet", sheetName, currentValue);
    if (typeof window !== "undefined" && window.WashmenBridge?.openSheet) {
      window.WashmenBridge.openSheet(sheetName, currentValue);
    }
  },

  onSheetResult(sheetName: NativeSheetName, callback: Listener) {
    console.log("[NativeBridge stub] onSheetResult listener for", sheetName);
    if (!listeners.has(sheetName)) listeners.set(sheetName, new Set());
    listeners.get(sheetName)!.add(callback);
    return () => listeners.get(sheetName)?.delete(callback);
  },

  /** Internal — invoked by native shell (or test harness) to deliver a result. */
  _deliver(sheetName: NativeSheetName, result: unknown) {
    listeners.get(sheetName)?.forEach((cb) => cb(result));
  },

  onBack(callback: () => boolean) {
    if (typeof window !== "undefined" && window.WashmenBridge?.onBack) {
      return window.WashmenBridge.onBack(callback);
    }
    return () => {};
  },

  dismiss() {
    if (typeof window !== "undefined" && window.WashmenBridge?.dismiss) {
      window.WashmenBridge.dismiss();
    }
  },

  getEntryRoute(): string | undefined {
    if (typeof window !== "undefined" && window.WashmenBridge?.entryRoute) {
      return window.WashmenBridge.entryRoute;
    }
    return undefined;
  },
};

// Expose deliver hook so the native shell can call back into JS.
if (typeof window !== "undefined") {
  (window as unknown as { __washmenDeliver?: typeof nativeBridge._deliver }).__washmenDeliver =
    nativeBridge._deliver;
}