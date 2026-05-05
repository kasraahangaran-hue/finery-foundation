import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * FineryFooter — sticky bottom band with optional insurance disclaimer.
 *
 * TODO(design): confirm insurance disclaimer copy + exact bg shade vs Figma.
 */

interface FineryFooterProps {
  children: ReactNode;
  insuranceNote?: ReactNode;
  animate?: boolean;
  className?: string;
}

export function FineryFooter({
  children,
  insuranceNote,
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
      {insuranceNote ? (
        <div className="bg-finery-purple-200 px-6 py-2 text-center font-sans text-[12px] leading-[16px] text-finery-purple-400">
          {insuranceNote}
        </div>
      ) : null}

      <div className="flex items-center gap-2 px-6 py-3">{children}</div>
    </footer>
  );
}