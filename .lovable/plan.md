## Plan: Delivery Times Bottom Sheet (Block 3D)

### 1. Create `src/components/finery/DeliveryTimesSheet.tsx`

New component using `BottomSheetShell` with `footer="apply-only"` and `primaryLabel="Done"`. On Done, calls `setDeliveryTimesAcknowledged(true)` then closes.

Contents (top to bottom inside the shell body):
- **Hero placeholder**: 150px tall div with a beige/teal gradient (real image later)
- **"Assessment Call" section**: h5 header + two paragraphs of explainer copy + `CallbackCheckboxRow` (existing component, default props — always shows checked)
- **0.4px purple hairline divider**
- **"Turnaround Time" section**: h5 header + explainer paragraph + four timing rows (Garments 3d, Bridal 8+d, Shoes & Bags 5-8d, Household 3d)

Timing rows: flex row with category (14px Inter Medium) and duration (16px Inria Regular tracking 0.6), beige-100 bg, p-2.

`CallbackCheckboxRow` already hardcodes label and checked state — no changes needed to that component.

### 2. Update `src/pages/finery/OrderStep1.tsx`

- Import `DeliveryTimesSheet`
- Add `deliverySheetOpen` state
- Replace `onDeliveryTap` console.log with `setDeliverySheetOpen(true)`
- Render `<DeliveryTimesSheet>` alongside `<SelectAddressSheet>`

### Files touched
- `src/components/finery/DeliveryTimesSheet.tsx` — **new**
- `src/pages/finery/OrderStep1.tsx` — **edit** (import, state, handler, JSX)

No changes to BottomSheetShell, CallbackCheckboxRow, FineryWidgetRow, or orderStore.
