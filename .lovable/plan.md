## Problem

`useOrderChrome` passes its config object's properties as `useEffect` dependencies (line 60). Properties like `onBack`, `cta`, and `supportSlot` are new references every render, causing an infinite update loop.

## Fix

Two changes in `src/components/primitives/OrderShell.tsx`:

1. **`useOrderChrome`** — Replace the `useEffect` with a `useRef` + render-time assignment pattern. Store the config in a ref and sync it to state only when values actually change (using a shallow-compare helper or `JSON.stringify` for primitive fields + `useRef` for stable callback/ReactNode identity).

   Simplest correct approach: use a `useRef` to hold the latest config and call `setChrome` with the ref's current value only on mount/unmount. The shell reads from the ref via a getter. This avoids dependency-array issues entirely.

   **Alternative (simpler):** Keep the `useEffect` but remove non-primitive deps (`onBack`, `cta`, `supportSlot`, `insuranceCopy`) from the dependency array. Store them in a ref so the shell always reads the latest value, while only re-running the effect when primitive values (`title`, `step`, `totalSteps`, `ctaKey`) change.

2. **`setChrome` callback** — Already tries `prev === next` bail-out but it never matches because `next` is always a new object. With approach above this becomes unnecessary, but we can also add a shallow-compare bail-out as a safety net.

### Concrete implementation (approach 2 — minimal diff)

```tsx
export function useOrderChrome(config: OrderChrome) {
  const ctx = useContext(ChromeContext);
  if (!ctx) throw new Error("useOrderChrome must be used inside <OrderShell />");
  const { setChrome } = ctx;
  const ref = useRef(config);
  ref.current = config;

  const { title, step, totalSteps, ctaKey } = config;
  useEffect(() => {
    setChrome(ref.current);
  }, [setChrome, title, step, totalSteps, ctaKey]);
}
```

This way only primitive/stable values trigger the effect. The ref ensures `onBack`/`cta`/etc. are always fresh when read.

### Files touched

- `src/components/primitives/OrderShell.tsx` — update `useOrderChrome` (lines 51-61)
