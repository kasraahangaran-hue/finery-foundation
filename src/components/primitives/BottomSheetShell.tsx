import type { ReactNode } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { FineryButton } from "@/components/finery/FineryButton";
import { haptics } from "@/utils/haptics";
import { cn } from "@/lib/utils";

/**
 * BottomSheetShell — Finery-themed bottom sheet primitive.
 *
 * Dimensions match laundry baseline:
 *   - max-h-[92vh] rounded-t-none
 *   - Header: px-6 pt-4
 *   - Body:   flex-1 overflow-y-auto no-scrollbar px-6 pt-2 pb-4
 *   - Footer: px-6 pt-3 pb-5
 *   - Title:  text-[20px] font-bold leading-[24px] tracking-[0.4px]
 *   - Bottom safe-area: pb-[max(env(safe-area-inset-bottom),1.25rem)]
 */

type FooterVariant = "apply-only" | "back-and-apply" | "dual-apply" | "none";

interface BottomSheetShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Right-side slot in the title row (next to the close X). */
  titleSlot?: ReactNode;
  /** Content rendered below the title row, INSIDE the header block. */
  titleAccessory?: ReactNode;
  /** When true, the entire header block (title + accessory) is omitted. */
  hideHeader?: boolean;
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
  titleAccessory,
  hideHeader = false,
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="border-none rounded-t-none max-h-[92vh] bg-finery-beige-200">
        <div className="flex max-h-[92vh] flex-col">
          {/* Header */}
          {!hideHeader && (
            <div className="flex flex-col gap-2 px-6 pt-6 pb-7">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-[18px] font-bold leading-[21px] tracking-[0.4px] text-finery-purple-400">
                  {title}
                </h2>
                {titleSlot}
              </div>
              {titleAccessory}
            </div>
          )}

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 pt-2 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {children}
          </div>

          {/* Footer */}
          {footer !== "none" && (
            <div className="bg-finery-beige-300 px-6 pt-3 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
              {footer === "apply-only" && (
                <FineryButton
                  onClick={() => fire(onPrimary)}
                  disabled={primaryDisabled}
                  className="w-full"
                >
                  {primaryLabel ?? "Apply"}
                </FineryButton>
              )}

              {footer === "back-and-apply" && (
                <div className="flex items-center gap-2">
                  <FineryButton
                    variant="tiny"
                    onClick={() => fire(onBack ?? (() => onOpenChange(false)))}
                    aria-label="Back"
                  />
                  <FineryButton
                    onClick={() => fire(onPrimary)}
                    disabled={primaryDisabled}
                  >
                    {primaryLabel ?? "Apply"}
                  </FineryButton>
                </div>
              )}

              {footer === "dual-apply" && (
                <div className="flex flex-col gap-2">
                  <FineryButton
                    onClick={() => fire(onPrimary)}
                    disabled={primaryDisabled}
                    className="w-full"
                  >
                    {primaryLabel ?? "Apply"}
                  </FineryButton>
                  <FineryButton
                    variant="outline"
                    onClick={() => fire(onSecondary)}
                    disabled={primaryDisabled}
                    className="w-full"
                  >
                    {secondaryLabel ?? "Apply Alt"}
                  </FineryButton>
                </div>
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
