import { cn } from "@/lib/utils";

interface FineryStepperProps {
  step: number;
  totalSteps?: number;
  className?: string;
}

export function FineryStepper({ step, totalSteps = 3, className }: FineryStepperProps) {
  return (
    <div
      className={cn("flex w-full gap-1", className)}
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${step} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }).map((_, i) => {
        const filled = i + 1 <= step;
        return (
          <div
            key={i}
            className="h-[2px] flex-1 rounded-full bg-finery-disabledBg"
          >
            <div
              className="h-full rounded-full bg-finery-purple-400 transition-transform duration-500 origin-left"
              style={{ transform: filled ? "scaleX(1)" : "scaleX(0)" }}
            />
          </div>
        );
      })}
    </div>
  );
}