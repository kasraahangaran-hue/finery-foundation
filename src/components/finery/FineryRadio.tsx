import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";

interface FineryRadioProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

export function FineryRadio({ label, selected, onSelect, className }: FineryRadioProps) {
  const handleTap = () => {
    haptics.light();
    onSelect();
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={handleTap}
      className={cn(
        "press-effect flex w-full items-center gap-3 px-2 py-2.5 min-h-[40px]",
        className,
      )}
    >
      <span
        className={cn(
          "shrink-0 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors duration-200",
          selected ? "border-finery-purple-400" : "border-finery-disabledBg",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "h-[10px] w-[10px] rounded-full bg-finery-purple-400 transition-all duration-200 ease-out",
            selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </span>
      <span
        className={cn(
          "flex-1 text-left text-[14px] leading-[20px] tracking-[0.1px]",
          selected
            ? "font-normal text-finery-purple-400"
            : "font-light text-finery-textSecondary",
        )}
      >
        {label}
      </span>
    </button>
  );
}