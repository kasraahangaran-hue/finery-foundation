import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PAGE_CTA_ROW_CLASSES } from "@/components/finery/ctaRowClasses";

/**
 * FineryFooter — page-level bottom band, two-row layout.
 *
 * Row 1: Insurance strip (purple.200, optional).
 * Row 2: Button row — uses shared CTA_ROW_CLASSES so page and sheet
 *   footers are pixel-identical.  The beige.300 band extends through
 *   the iOS safe-area zone.
 */

interface FineryFooterProps {
  children: ReactNode;
  insuranceCopy?: ReactNode | null;
  animate?: boolean;
  className?: string;
}

const DEFAULT_INSURANCE: ReactNode = (
  <>Insurance protection up to AED 10,000</>
);

export function FineryFooter({
  children,
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

      <div className={PAGE_CTA_ROW_CLASSES}>
        {children}
      </div>
    </footer>
  );
}