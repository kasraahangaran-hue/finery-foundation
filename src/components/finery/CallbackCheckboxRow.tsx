import { RawSvg } from "@/components/finery/RawSvg";
import phoneUrl from "@/assets/icons/finery/phone.svg?raw";
import checkboxDisabledUrl from "@/assets/icons/finery/checkbox-disabled.svg?raw";
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
      <RawSvg svg={phoneUrl} className="h-[22px] w-[22px] shrink-0" />

      <span className="flex-1 font-display text-[15px] font-bold tracking-[0.2px] text-finery-purple-400">
        {label}
      </span>

      <RawSvg svg={checkboxDisabledUrl} className="h-[18px] w-[18px] shrink-0" />
    </div>
  );
}