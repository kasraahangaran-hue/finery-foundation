I found the mismatch: the main page footer applies the safe-area padding on the actual beige CTA band, but the bottom sheet currently applies safe-area padding on the outer DrawerContent and only `pb-5` on the CTA band. That leaves extra beige space outside the footer structure and makes the button sit closer to the visible bottom than the main page footer.

Plan:
1. Update `BottomSheetShell.tsx` so the footer CTA band uses the exact same bottom padding expression as `FineryFooter`:
   - `pb-[max(env(safe-area-inset-bottom),1.25rem)]`
   - keep `px-6 pt-3` the same.

2. Remove the duplicate bottom padding from the outer `DrawerContent`:
   - remove `pb-[max(env(safe-area-inset-bottom),1.25rem)]` from `DrawerContent`
   - this prevents the sheet from having a separate safe-area spacer outside the CTA band.

3. Keep the bottom-sheet CTA buttons as `FineryButton`, so button height, typography, horizontal padding, and variants continue matching the main order page.

4. Update the comments in `BottomSheetShell.tsx` to reflect the new source of truth: safe-area spacing belongs to the beige footer band, matching `FineryFooter`.

Expected result: when opening a bottom sheet, the CTA area will feel identical to the main page footer—the beige band owns the safe-area/home-indicator space and the button’s distance from the bottom matches the outside page.