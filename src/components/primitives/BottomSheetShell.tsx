import type { ReactNode } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { FineryButton } from "@/components/finery/FineryButton";
import { haptics } from "@/utils/haptics";
import { cn } from "@/lib/utils";

/**
 * BottomSheetShell — Finery-themed bottom sheet primitive.
 *
 * Reverted to laundry's inline-footer pattern:
 *   - DrawerContent owns the safe-area inset (pb-[max(env(safe-area-inset-bottom),1rem)])
 *   - Footer is an inline div: bg-finery-beige-300 px-6 pt-3 pb-4
 *   - No drop shadow on the sheet footer (unnecessary — sheet is already layered)
 */

type FooterVariant = "apply-only" | "back-and-apply" | "dual-apply" | "none";

interface BottomSheetShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  titleSlot?: ReactNode;
  titleAccessory?: ReactNode;
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
      <DrawerContent className="border-none rounded-t-none max-h-[92vh] bg-finery-beige-200 pb-[max(env(safe-area-inset-bottom),1rem)]">
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

          {/* Footer — inline block, laundry pattern */}
          {footer !== "none" && (
            <div className="flex items-center gap-2 bg-finery-beige-300 px-6 pt-3 pb-4">
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
                <>
                  <FineryButton
                    variant="tiny"
                    onClick={() => fire(onBack ?? (() => onOpenChange(false)))}
                    aria-label="Back"
                  />
                  <FineryButton
                    onClick={() => fire(onPrimary)}
                    disabled={primaryDisabled}
                    className="flex-1"
                  >
                    {primaryLabel ?? "Apply"}
                  </FineryButton>
                </>
              )}

              {footer === "dual-apply" && (
                <div className="flex w-full flex-col gap-2">
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
