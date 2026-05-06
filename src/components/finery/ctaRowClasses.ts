/**
 * Shared CTA-row geometry for FineryFooter (page) and BottomSheetShell
 * (drawer).  Base classes keep horizontal padding, top padding, button
 * gap, and background colour in one place.  Bottom padding is split
 * because the fixed Vaul drawer context eats ~8 px in mobile viewports
 * compared to a normal-flow page footer.
 */

const CTA_ROW_BASE =
  "flex items-center gap-2 bg-finery-beige-300 px-6 pt-3";

/** Page footer — normal flow, 20 px floor. */
export const PAGE_CTA_ROW_CLASSES =
  `${CTA_ROW_BASE} pb-[max(env(safe-area-inset-bottom),1.25rem)]`;

/** Sheet footer — inside fixed Vaul drawer, bumped to 28 px floor so
 *  the visible gap below the button matches the page footer in mobile. */
export const SHEET_CTA_ROW_CLASSES =
  `${CTA_ROW_BASE} pb-[max(env(safe-area-inset-bottom),1.75rem)]`;