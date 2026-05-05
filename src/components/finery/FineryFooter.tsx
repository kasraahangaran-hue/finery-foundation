import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * FineryFooter — sticky bottom band.
 *
 * Layout (top to bottom):
 *   1. Insurance strip — purple.200 bg, 30px tall, Roboto 13/18, centered
 *   2. Button row — beige.300 bg, holds tiny back button + main CTA
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
        "mt-auto w-full pb-safe",
        animate && "animate-footer-in",
        className,
      )}
    >
      {insuranceCopy ? (
        <div className="flex h-[30px] items-center justify-center bg-finery-purple-200 px-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <span className="text-[13px] leading-[18px] text-finery-purple-400">
            {insuranceCopy}
          </span>
        </div>
      ) : null}

      <div className="flex items-center gap-2 bg-finery-beige-300 px-6 py-3">{children}</div>
    </footer>
  );
}