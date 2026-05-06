import { Phone, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CallbackCheckboxRow — informational read-only row.
 * Static indicator: phone icon left, label centre, disabled checkbox right.
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
        "flex items-center gap-3 pointer-events-none",
        className,
      )}
    >
      <Phone className="h-[22px] w-[22px] shrink-0 text-finery-purple-400" strokeWidth={1.5} />

      <span className="flex-1 font-display text-[15px] font-bold tracking-[0.2px] text-finery-purple-400">
        {label}
      </span>

      <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[2px] bg-finery-disabledBg border border-finery-disabledText">
        <Check className="h-3 w-3 text-white" strokeWidth={3} />
      </div>
    </div>
  );
}