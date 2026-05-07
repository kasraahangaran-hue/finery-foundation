import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FineryButton } from "@/components/finery/FineryButton";
import { haptics } from "@/utils/haptics";

interface DeleteItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteItemDialog({ open, onOpenChange, onConfirm }: DeleteItemDialogProps) {
  const handleConfirm = () => {
    haptics.medium();
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    haptics.light();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] max-w-[320px] rounded-none border-none bg-finery-beige-200 p-6 text-center [&>button]:hidden">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-[16px] font-bold leading-[20px] text-finery-purple-400">
            Delete Item
          </h2>
          <p className="font-sans text-[13px] font-light leading-[18px] text-finery-textSecondary">
            Are you sure you want to delete this item?
          </p>
          <FineryButton onClick={handleConfirm} className="w-full">
            Yes, delete item
          </FineryButton>
          <button
            onClick={handleCancel}
            className="press-effect font-sans text-sm font-medium leading-[20px] text-finery-textSecondary"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}