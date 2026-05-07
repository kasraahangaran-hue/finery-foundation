After inspecting all three order flow pages side by side in the browser at 390×844:

- **Page 1** (`/`) — "The Finery® Order" — single-line title, stepper below
- **Page 2** (`/order/instructions`) — "Order Instructions (optional)" — single-line title, stepper below
- **Page 3** (`/order/last-step`) — "Last Step" — single-line title, stepper below

The stepper sits at the same vertical position on all three pages. The title text "(optional)" is indeed on the same line — no wrapping is happening. The header structure (`px-6 pt-[max(env(safe-area-inset-top),24px)] pb-3` → title → stepper with `mt-3`) is shared via `OrderShell`, so all pages render identically.

**No code change is needed.** If you're seeing a difference on a specific device or browser, let me know and I can investigate further.