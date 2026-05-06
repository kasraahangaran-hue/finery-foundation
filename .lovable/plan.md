## Fix FineryButton vertical shrink in flex-col contexts

**File:** `src/components/finery/FineryButton.tsx`

Replace `flex-1` with `shrink-0` in both `primary` and `outline` variant classes. This prevents the button from shrinking below its fixed `h-[42px]` height when inside a `flex-col` parent (like the map screen footer).

No other files need changes — all consumers already pass `w-full` or use a flex wrapper for width control.