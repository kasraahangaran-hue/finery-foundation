import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { haptics } from "@/utils/haptics";
import { cn } from "@/lib/utils";

interface BottomSheetShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  titleSlot?: ReactNode;
  children: ReactNode;
  footer?: "none";
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
}

export function BottomSheetShell({
  open,
  onOpenChange,
  title,
  titleSlot,
  children,
}: BottomSheetShellProps) {
  const handleClose = () => {
    haptics.light();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-finery-beige-200 border-none rounded-t-[16px] max-h-[85vh]">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-4 pb-3">
            <h2 className="font-display text-[16px] font-bold text-finery-purple-400">
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
          <div className="overflow-y-auto px-6 pb-6">
            {children}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}