I found the issue: the shared CTA row class is identical in code, but mobile drawer geometry is not identical to the page footer context. The sheet is rendered in Vaul's fixed portal at the viewport edge, and on mobile that bottom-fixed drawer is getting a different effective safe-area/viewport treatment than the normal page footer. So the shared class kept the CSS string aligned, but it also hid the fact that the two containers need slightly different safe-area handling.

Plan:

1. Keep the existing shared CTA row base geometry
   - Preserve the shared horizontal padding, top padding, gap, beige.300 background, and button sizing.
   - Do not go back to duplicated random footer classes.

2. Split only the bottom padding token by context
   - Page footer keeps the current page-safe behavior.
   - Bottom sheet footer gets its own sheet-safe bottom padding so it visually matches the page footer in mobile preview, not just desktop.
   - This should be done with named constants, e.g. shared base row classes plus `PAGE_CTA_ROW_CLASSES` and `SHEET_CTA_ROW_CLASSES`, so future edits are intentional.

3. Apply the sheet-specific class only in `BottomSheetShell`
   - `FineryFooter` continues using the page CTA row class.
   - `BottomSheetShell` uses the sheet CTA row class.
   - `SelectAddressSheet` remains unaffected because it uses `footer="none"`.

4. Verify in the mobile viewport
   - Check `/` at the 390-ish mobile viewport.
   - Compare the page footer CTA and Delivery bottom-sheet CTA.
   - Confirm the distance under the button reads cohesive in mobile view and desktop still remains matched.

Technical detail:

The previous shared class currently uses:

```text
pb-[max(env(safe-area-inset-bottom),1.25rem)]
```

That is correct for the normal page footer, but inside the fixed Vaul drawer mobile preview it produces a different visible result. I’ll keep the shared base classes and adjust only the sheet footer’s bottom padding floor/handling so the visible CTA alignment matches the page footer in the actual mobile context.