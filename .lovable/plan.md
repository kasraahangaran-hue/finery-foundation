Answer: the page CTA container is not `sticky` or `fixed`. It is a normal footer at the end of a full-height flex column.

Current structure:

```text
OrderShell
└─ div.flex.min-h-[100dvh].flex-col
   ├─ header: shrink-0
   ├─ body: flex-1
   └─ FineryFooter: shrink-0
      ├─ insurance strip
      └─ CTA row: beige.300 px-6 pt-3 pb-[max(safe-area,1.25rem)]
```

So the page footer is aligned to the bottom because the body has `flex-1` and pushes `FineryFooter` down. It is not floating independently.

The sheet CTA is different by nature because Vaul drawers render in a portal and `DrawerContent` is `fixed inset-x-0 bottom-0`. Inside that fixed drawer, the sheet footer is a normal final flex child:

```text
Drawer portal
└─ DrawerContent: fixed bottom-0
   └─ div.flex.max-h-[92vh].flex-col
      ├─ header/body
      └─ sheet CTA row: beige.300 px-6 pt-3 pb-[max(safe-area,1.25rem)]
```

So yes: the sheet's outer container is fixed to the viewport bottom. The CTA row itself is not sticky; it sits at the bottom of that fixed drawer.

Why this has been hard: we were matching padding numbers, but the two footers are not in identical parent contexts:
- Page footer includes the insurance strip and a shadow.
- Sheet footer has no insurance strip/shadow and lives inside a fixed drawer portal.
- The page screenshot also has the floating dev/state-inspector button overlapping the bottom-right CTA area, which makes visual comparison noisier.
- `BottomSheetShell` comments are now stale and still mention the old safe-area ownership, even though the code was patched.

Plan to make this cohesive and easier to reason about:

1. Introduce a shared CTA row primitive/style used by both page footer and sheet footer.
   - Same classes: `flex items-center gap-2 bg-finery-beige-300 px-6 pt-3 pb-[max(env(safe-area-inset-bottom),1.25rem)]`.
   - This keeps the button row geometry exactly identical in one place.

2. Keep different outer containers only where they are genuinely different.
   - Page: `FineryFooter` remains a normal `shrink-0` footer in `OrderShell`.
   - Sheet: `DrawerContent` remains `fixed bottom-0` via Vaul, and the shared CTA row remains the final child inside the drawer.
   - Do not make the sheet CTA sticky unless we need a very tall sheet body where the CTA must remain visible while internal content scrolls. The current flex layout already keeps it visible.

3. Clean up stale comments in `BottomSheetShell` and `FineryFooter`.
   - Update docs so they match the current ownership: safe-area padding belongs to the beige CTA row, not the drawer background.

4. Optional visual-debug pass after the code change.
   - At 390x844, capture the page footer and delivery sheet footer.
   - Verify the CTA row uses identical horizontal padding, top padding, button height, and bottom safe-area floor.
   - Verify the beige.300 band reaches the bottom edge for both contexts.