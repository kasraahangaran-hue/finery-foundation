## Problem

The bottom sheet CTA area doesn't visually match the main page footer. The root cause is structural: the main page uses `FineryFooter` (which has a `flex items-center gap-2` button row + top shadow), while the bottom sheet uses a plain `<div>` wrapper for its buttons. This creates subtle differences in button layout and visual weight.

## Plan

### 1. Update `BottomSheetShell.tsx` — use `FineryFooter` for the footer band

Replace the current plain `<div className="bg-finery-beige-300 px-6 pt-3 pb-[...]">` footer with the actual `FineryFooter` component (with `insuranceCopy={null}` to hide the insurance strip). This guarantees:
- Identical `flex items-center gap-2` button row layout
- Same shadow, same bg, same padding expression
- Single source of truth for footer styling

### 2. Adjust button wrappers inside the footer

Wrap each footer variant's buttons the same way `OrderShell` does — inside a `flex-1` div — so the `flex-1` on `FineryButton` behaves identically in both contexts.

### Expected result

The bottom sheet CTA band will be pixel-identical to the main page footer (minus the insurance strip), with matching shadow, padding, button sizing, and spacing from the bottom of the screen.
