import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CallbackCheckboxRow — pre-checked, disabled checkbox row.
 *
 * TODO(design): confirm exact label copy, padding, checkbox size vs Figma.
 */

interface CallbackCheckboxRowProps {
  label?: string;
  className?: string;
}

export function CallbackCheckboxRow({
  label = "Callback before processing items",
  className,
}: CallbackCheckboxRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-finery-beige-300 px-4 py-3 pointer-events-none",
        className,
      )}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center bg-finery-purple-400">
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </div>

      <span className="font-sans text-[14px] font-normal leading-[20px] text-finery-textSecondary">
        {label}
      </span>
    </div>
  );
}