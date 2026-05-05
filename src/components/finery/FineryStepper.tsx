import { cn } from "@/lib/utils";

interface FineryStepperProps {
  step: 1 | 2 | 3;
  className?: string;
}

const TOTAL_STEPS = 3;

export function FineryStepper({ step, className }: FineryStepperProps) {
  return (
    <div className={cn("flex w-full gap-1", className)}>
    <div className={cn("flex w-full gap-[6px]", className)}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const filled = i + 1 <= step;
        return (
          <div
            key={i}
            className={cn(
          "h-[2px] flex-1 transition-all duration-500",
              filled ? "bg-finery-purple-400 scale-x-100" : "bg-finery-disabledBg",
            )}
          />
        );
      })}
    </div>
  );
}