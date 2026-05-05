import { cn } from "@/lib/utils";

/**
 * FineryStepper — 3-segment phase indicator.
 * Filled = purple.400, unfilled = finery.disabledBg.
 *
 * TODO(design): confirm exact unfilled color + segment gap vs Figma.
 */

interface FineryStepperProps {
  step: 1 | 2 | 3;
  className?: string;
}

const TOTAL_STEPS = 3;

export function FineryStepper({ step, className }: FineryStepperProps) {
  return (
    <div className={cn("flex w-full gap-1", className)}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const filled = i + 1 <= step;
        return (
          <div
            key={i}
            className={cn(
              "h-[2px] flex-1 rounded-full transition-all duration-500",
              filled ? "bg-finery-purple-400 scale-x-100" : "bg-finery-disabledBg",
            )}
          />
        );
      })}
    </div>
  );
}