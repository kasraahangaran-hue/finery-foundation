import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FineryButton } from "@/components/finery/FineryButton";
import { haptics } from "@/utils/haptics";

interface DeleteAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAddressDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteAddressDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-[320px] rounded-none border-none bg-finery-beige-200 p-6 text-center [&>button]:hidden">
        <h3 className="font-display text-[16px] font-bold leading-[20px] text-finery-purple-400">
          Delete Address
        </h3>
        <p className="mt-1 font-sans text-[13px] font-light leading-[18px] text-finery-textSecondary">
          Are you sure you want to delete this address?
        </p>
        <FineryButton
          onClick={() => {
            haptics.warning();
            onConfirm();
            onOpenChange(false);
          }}
          className="mt-2 w-full"
        >
          Yes, delete address
        </FineryButton>
        <button
          onClick={() => {
            haptics.light();
            onOpenChange(false);
          }}
          className="press-effect font-sans text-sm font-medium leading-[20px] text-finery-textSecondary"
        >
          Cancel
        </button>
      </DialogContent>
    </Dialog>
  );
}