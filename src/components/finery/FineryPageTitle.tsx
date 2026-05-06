import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FineryPageTitleProps {
  children: ReactNode;
  className?: string;
}

/**
 * FineryPageTitle — top-of-page title used by OrderShell-hosted pages.
 *
 * Typography matches Finery main-page-title spec: Inria Bold 20/28
 * tracking normal, purple.400. Sheet titles use a different spec
 * (Inria Bold 18/21 tracking 0.4) and live in BottomSheetShell —
 * deliberately separate, do NOT use this component for sheet titles.
 */
export function FineryPageTitle({ children, className }: FineryPageTitleProps) {
  return (
    <h1
      className={cn(
        "font-display text-[20px] font-bold leading-[28px] tracking-normal text-finery-purple-400",
        className,
      )}
    >
      {children}
    </h1>
  );
}