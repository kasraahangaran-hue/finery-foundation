import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * FineryFooter — sticky bottom band, two-row layout.
 *
 * Row 1 (top): Insurance strip — full-width purple.200 band, 30px tall,
 *   Roboto 13/18 in textSecondary. Optional via insuranceCopy=null.
 * Row 2 (bottom): Button row — beige.300 bg, holds tiny back + primary CTA.
 *   This row's bg extends through the iOS safe-area zone so the home
 *   indicator sits on the same beige.300 color, not the page bg.
 *
 * Dimensions match laundry baseline:
 *   - shrink-0 (not mt-auto) so it pins correctly inside an
 *     overflow-hidden flex-col parent
 *   - Button row: gap-2 px-6 pt-3 pb-4
 *   - Safe-area: pb-[max(env(safe-area-inset-bottom),1rem)]
 *   - Drop shadow: shadow-[0px_-1px_8px_rgba(0,0,0,0.06)]
 *
 * Differs from laundry only in:
 *   - Two-row layout with the bespoke insurance strip (Finery-only pattern)
 *   - bg-finery-beige-300 on the button row instead of the laundry footer-tint
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

      <div className="flex items-center gap-2 bg-finery-beige-300 px-6 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {children}
      </div>
    </footer>
  );
}