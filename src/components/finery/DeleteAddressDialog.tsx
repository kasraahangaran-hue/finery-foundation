import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      <DialogContent className="w-[85%] max-w-[320px] rounded-[12px] border-none bg-finery-beige-200 p-6 text-center [&>button]:hidden">
        <h3 className="font-display text-[16px] font-bold leading-[20px] text-finery-purple-400">
          Delete Address
        </h3>
        <p className="mt-1 font-sans text-[13px] font-light leading-[18px] text-finery-textSecondary">
          Are you sure you want to delete this address?
        </p>
        <button
          onClick={() => {
            haptics.warning();
            onConfirm();
            onOpenChange(false);
          }}
          className="press-effect mt-2 h-[42px] w-full rounded-[8px] bg-finery-purple-400 font-display text-sm font-bold leading-[20px] text-finery-beige-100"
        >
          Yes, delete address
        </button>
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