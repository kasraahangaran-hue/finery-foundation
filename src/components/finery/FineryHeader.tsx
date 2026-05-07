import type { ReactNode } from "react";
import { RawSvg } from "@/components/finery/RawSvg";
import backArrowUrl from "@/assets/icons/finery/back-arrow.svg?raw";
import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";

/**
 * FineryHeader — back button (left) + center title + 2 trailing icon slots.
 *
 * TODO(design): confirm exact title size / padding / icon spacing vs Figma.
 */

interface FineryHeaderProps {
  title: string;
  onBack?: () => void;
  trailingSlot1?: ReactNode;
  trailingSlot2?: ReactNode;
  className?: string;
}

export function FineryHeader({
  title,
  onBack,
  trailingSlot1,
  trailingSlot2,
  className,
}: FineryHeaderProps) {
  const handleBack = () => {
    if (!onBack) return;
    haptics.light();
    onBack();
  };

  return (
    <header className={cn("flex w-full items-center px-6 pt-safe", className)}>
      <div className="flex h-[56px] w-full items-center">
        <div className="flex w-10 shrink-0 items-center">
          {onBack ? (
            <button type="button" onClick={handleBack} className="press-effect flex h-10 w-10 items-center justify-center">
              <RawSvg svg={backArrowUrl} className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        <h1 className="flex-1 text-center font-display text-[22px] font-bold leading-[28px] text-finery-purple-400 truncate">
          {title}
        </h1>

        <div className="flex w-20 shrink-0 items-center justify-end gap-2">
          {trailingSlot1 ? (
            <span className="flex h-10 w-10 items-center justify-center text-finery-purple-400">{trailingSlot1}</span>
          ) : null}
          {trailingSlot2 ? (
            <span className="flex h-10 w-10 items-center justify-center text-finery-purple-400">{trailingSlot2}</span>
          ) : null}
        </div>
      </div>
    </header>
  );
}