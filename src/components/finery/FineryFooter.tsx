import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FineryButton } from "@/components/finery/FineryButton";
import { PAGE_CTA_ROW_CLASSES } from "@/components/finery/ctaRowClasses";

/**
 * FineryFooter — page-level bottom band, multi-row layout.
 *
 * Row 1: Insurance strip (purple.200, optional).
 * Row 2 (optional): aboveSlot — content above the button row, e.g. tip
 *                   selector on Last Step. Sits inside the beige.300 band.
 * Row 3: Button row — uses PAGE_CTA_ROW_CLASSES. Contains the optional
 *        back button on the left and the CTA on the right.
 */

interface FineryFooterProps {
  /** Primary action element. Sits flex-1 next to the optional back button. */
  cta: ReactNode;
  /** When provided, renders a tiny back button to the left of the CTA. */
  onBack?: () => void;
  /** Optional content rendered above the back+cta row, inside the beige.300 band. */
  aboveSlot?: ReactNode;
  insuranceCopy?: ReactNode | null;
  animate?: boolean;
  className?: string;
}

const DEFAULT_INSURANCE: ReactNode = (
  <>Insurance protection up to AED 10,000</>
);

export function FineryFooter({
  cta,
  onBack,
  aboveSlot,
  insuranceCopy = DEFAULT_INSURANCE,
  animate = false,
  className,
}: FineryFooterProps) {
  return (
    <footer
      className={cn(
        "shrink-0 w-full shadow-[0px_-1px_8px_rgba(0,0,0,0.06)]",
        animate && "animate-footer-in",
        className,
      )}
    >
      {insuranceCopy ? (
        <div
          className="flex h-[30px] items-center justify-center bg-finery-purple-200 px-6"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <span className="text-[13px] leading-[18px] text-finery-textSecondary">
            {insuranceCopy}
          </span>
        </div>
      ) : null}

      {aboveSlot ? (
        <div className="bg-finery-beige-300 px-6 pt-3">{aboveSlot}</div>
      ) : null}

      <div className={PAGE_CTA_ROW_CLASSES}>
        {onBack ? (
          <FineryButton variant="tiny" onClick={onBack} aria-label="Back" />
        ) : null}
        <div className="flex-1">{cta}</div>
      </div>
    </footer>
  );
}