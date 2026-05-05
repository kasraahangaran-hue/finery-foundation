import type { ReactNode } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { haptics } from "@/utils/haptics";
import { cn } from "@/lib/utils";

/**
 * BottomSheetShell — Finery-themed bottom sheet primitive.
 *
 * Dimensions match laundry baseline:
 *   - max-h-[92vh] rounded-t-[24px]
 *   - Header: px-6 pt-4
 *   - Body:   flex-1 overflow-y-auto no-scrollbar px-6 pt-2 pb-4
 *   - Footer: px-6 pt-3 pb-4
 *   - Title:  text-[20px] font-bold leading-[24px] tracking-[0.4px]
 *   - Bottom safe-area: pb-[max(env(safe-area-inset-bottom),1rem)]
 */

type FooterVariant = "apply-only" | "back-and-apply" | "dual-apply" | "none";

interface BottomSheetShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  titleSlot?: ReactNode;
  children: ReactNode;
  footer: FooterVariant;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onBack?: () => void;
  primaryDisabled?: boolean;
}

export function BottomSheetShell({
  open,
  onOpenChange,
  title,
  titleSlot,
  children,
  footer,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onBack,
  primaryDisabled = false,
}: BottomSheetShellProps) {
  const fire = (cb?: () => void) => {
    haptics.light();
    cb?.();
  };

  const handleClose = () => {
    haptics.light();
    onOpenChange(false);
  };

  const primaryBtnClass = cn(
    "press-effect h-[42px] w-full rounded-[8px] bg-finery-purple-400 text-finery-beige-100",
    "font-display text-sm font-bold transition-colors hover:bg-finery-purple-400/90",
    "flex items-center justify-center",
    "disabled:bg-finery-disabledBg disabled:text-finery-disabledText disabled:cursor-not-allowed",
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-none rounded-t-[24px] max-h-[92vh] bg-finery-beige-200">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-4">
            <h2 className="font-display text-[20px] font-bold leading-[24px] tracking-[0.4px] text-finery-purple-400">
              {title}
            </h2>
            <div className="flex items-center gap-2">
              {titleSlot}
              <button
                onClick={handleClose}
                className="press-effect flex h-8 w-8 items-center justify-center"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-finery-purple-400" />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 pt-2 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {children}
          </div>

          {/* Footer */}
          {footer !== "none" && (
            <div className="px-6 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)]">
              {footer === "apply-only" && (
                <button
                  className={primaryBtnClass}
                  onClick={() => fire(onPrimary)}
                  disabled={primaryDisabled}
                >
                  {primaryLabel ?? "Apply"}
                </button>
              )}

              {footer === "back-and-apply" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fire(onBack ?? (() => onOpenChange(false)))}
                    className="press-effect flex h-[42px] w-12 shrink-0 items-center justify-center rounded-[8px] border border-finery-purple-400 bg-finery-beige-100"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-5 w-5 text-finery-purple-400" />
                  </button>
                  <button
                    className={primaryBtnClass}
                    onClick={() => fire(onPrimary)}
                    disabled={primaryDisabled}
                  >
                    {primaryLabel ?? "Apply"}
                  </button>
                </div>
              )}

              {footer === "dual-apply" && (
                <div className="flex flex-col gap-2">
                  <button
                    className={primaryBtnClass}
                    onClick={() => fire(onPrimary)}
                    disabled={primaryDisabled}
                  >
                    {primaryLabel ?? "Apply"}
                  </button>
                  <button
                    className={cn(primaryBtnClass, "bg-finery-beige-100 text-finery-purple-400 border border-finery-purple-400 hover:bg-finery-beige-100/80")}
                    onClick={() => fire(onSecondary)}
                    disabled={primaryDisabled}
                  >
                    {secondaryLabel ?? "Apply Alt"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}