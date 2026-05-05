import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";

/**
 * FineryButton — primary CTA, outline, and tiny back-button variants.
 *
 * TODO(design): confirm exact heights/padding/radius vs Figma when available.
 */

type Variant = "primary" | "outline" | "tiny";

interface FineryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children?: ReactNode;
}

const baseClasses =
  "press-effect flex items-center justify-center font-display transition-colors disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  primary: cn(
    "h-[42px] w-full rounded-[8px] text-[14px] font-normal",
    "bg-finery-purple-400 text-finery-beige-100",
    "hover:bg-finery-purple-400/90",
    "disabled:bg-finery-disabledBg disabled:text-finery-disabledText",
  ),
  outline: cn(
    "h-[42px] w-full rounded-[8px] text-[14px] font-normal",
    "bg-finery-beige-100 text-finery-purple-400",
    "border border-finery-purple-400",
    "hover:bg-finery-beige-100/80",
    "disabled:bg-finery-disabledBg disabled:text-finery-disabledText disabled:border-finery-disabledBg",
  ),
  tiny: cn(
    "h-[42px] w-[42px] rounded-[8px]",
    "bg-finery-beige-100 text-finery-purple-400",
    "border border-finery-purple-400",
    "hover:bg-finery-beige-100/80",
    "disabled:bg-finery-disabledBg disabled:text-finery-disabledText disabled:border-finery-disabledBg",
  ),
};

export const FineryButton = forwardRef<HTMLButtonElement, FineryButtonProps>(
  ({ variant = "primary", className, children, onClick, disabled, type = "button", ...rest }, ref) => {
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (disabled) return;
      haptics.light();
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={handleClick}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...rest}
      >
        {variant === "tiny" ? <ChevronLeft className="h-4 w-4" /> : children}
      </button>
    );
  },
);

FineryButton.displayName = "FineryButton";