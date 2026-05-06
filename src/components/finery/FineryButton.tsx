import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FineryButton — primary CTA, outline, and tiny back-button variants.
 *
 * Dimensions match laundry baseline:
 *   - primary/outline: h-[42px] rounded-[8px] text-sm font-bold
 *     (font-bold is Inria's closest match to laundry's font-semibold;
 *      Inria Serif doesn't load weight 600)
 *   - tiny: h-[42px] w-12 rounded-[8px] (48×42, matches laundry BackButton bordered)
 */

type Variant = "primary" | "outline" | "tiny";

interface FineryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children?: ReactNode;
}

const baseClasses =
  "press-effect inline-flex items-center justify-center font-display transition-colors disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  primary: cn(
    "h-[42px] shrink-0 text-sm font-bold",
    "bg-finery-purple-400 text-finery-beige-100",
    "hover:bg-finery-purple-400/90",
    "disabled:bg-finery-disabledBg disabled:text-finery-disabledText",
  ),
  outline: cn(
    "h-[42px] shrink-0 text-sm font-bold",
    "bg-finery-beige-100 text-finery-purple-400",
    "border border-finery-purple-400",
    "hover:bg-finery-beige-100/80",
    "disabled:bg-finery-disabledBg disabled:text-finery-disabledText disabled:border-finery-disabledBg",
  ),
  tiny: cn(
    "h-[42px] w-12 shrink-0",
    "bg-finery-beige-100 text-finery-purple-400",
    "border border-finery-purple-400",
    "hover:bg-finery-beige-100/80",
    "disabled:bg-finery-disabledBg disabled:text-finery-disabledText disabled:border-finery-disabledBg",
  ),
};

export const FineryButton = forwardRef<HTMLButtonElement, FineryButtonProps>(
  ({ variant = "primary", className, children, onClick, disabled, type = "button", ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...rest}
      >
        {variant === "tiny" ? (children ?? <ChevronLeft className="h-5 w-5" />) : children}
      </button>
    );
  },
);

FineryButton.displayName = "FineryButton";