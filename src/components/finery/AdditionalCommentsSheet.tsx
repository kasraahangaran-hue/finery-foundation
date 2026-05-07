import { useEffect, useState } from "react";
import { BottomSheetShell } from "@/components/primitives/BottomSheetShell";

interface AdditionalCommentsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: string;
  onSave: (value: string) => void;
}

export function AdditionalCommentsSheet({
  open,
  onOpenChange,
  initialValue,
  onSave,
}: AdditionalCommentsSheetProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const handleSave = () => {
    onSave(value);
    onOpenChange(false);
  };

  return (
    <BottomSheetShell
      open={open}
      onOpenChange={onOpenChange}
      title="Additional Comments"
      footer="apply-only"
      primaryLabel="Save"
      onPrimary={handleSave}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add any further instructions for our team"
        className="w-full h-[166px] resize-none border border-finery-disabledBg bg-transparent px-3 py-2.5 text-[12px] font-light leading-[18px] tracking-[0.1px] text-finery-purple-400 placeholder:text-finery-disabledText focus:outline-none focus:border-finery-purple-400"
      />
    </BottomSheetShell>
  );
}