
## Problem

The app uses `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` in the header and footer, but `index.html` is missing `viewport-fit=cover` on the viewport meta tag. Without it, iOS/Android WebViews ignore those environment variables entirely — they always resolve to `0px`.

## Changes

### 1. `index.html` — enable safe area insets

Change the viewport meta to:
```
width=device-width, initial-scale=1.0, viewport-fit=cover
```

This is the single critical fix. Once enabled, the existing `env(safe-area-inset-*)` references in OrderShell header (`pt-[max(env(safe-area-inset-top),18px)]`) and FineryFooter (`pb-[max(env(safe-area-inset-bottom),1rem)]`) will start working correctly on notched/dynamic-island devices.

### 2. `FineryFooter.tsx` — increase minimum bottom padding

The current fallback `1rem` (16px) is tight for the iOS home indicator area. Bump to `1.25rem` (20px) so the CTA row has comfortable clearance even on older devices where the inset is small.

### 3. `BottomSheetShell.tsx` — same bottom padding bump

The sheet footer also uses `pb-[max(env(safe-area-inset-bottom),1rem)]`. Bump to `1.25rem` for consistency.

No other files need changes — `FineryHeader` uses `pt-safe` (which maps to `env(safe-area-inset-top)`) and the OrderShell header already has the correct `max()` pattern.
