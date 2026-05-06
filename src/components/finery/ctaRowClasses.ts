/**
 * Shared CTA-row class string used by both FineryFooter (page) and
 * BottomSheetShell (drawer).  Keeping this in one place guarantees
 * identical horizontal padding, top padding, button gap, background
 * colour, and safe-area bottom floor across every CTA surface.
 */
export const CTA_ROW_CLASSES =
  "flex items-center gap-2 bg-finery-beige-300 px-6 pt-3 pb-[max(env(safe-area-inset-bottom),1.25rem)]";