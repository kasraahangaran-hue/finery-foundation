import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";

/**
 * FineryWidgetRow — 66px tappable row with active/locked/summary variants.
 *
 * TODO(design): many visual decisions are guesses — revisit with Figma.
 */

type Variant = "active" | "locked" | "summary";

interface FineryWidgetRowProps {
  variant: Variant;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const variantSurface: Record<Variant, string> = {
  active: "bg-finery-beige-300",
  locked: "bg-finery-beige-200",
  summary: "bg-finery-beige-100",
};

const variantTitleColor: Record<Variant, string> = {
  active: "text-finery-purple-400",
  locked: "text-finery-disabledText",
  summary: "text-finery-textSecondary",
};

const variantIconColor: Record<Variant, string> = {
  active: "text-finery-purple-400",
  locked: "text-finery-disabledText",
  summary: "text-finery-textSecondary",
};

export function FineryWidgetRow({
  variant,
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  className,
}: FineryWidgetRowProps) {
  const isInteractive = variant === "active" && Boolean(onClick);

  const handleClick = () => {
    if (!isInteractive) return;
    haptics.light();
    onClick?.();
  };

  const defaultTrailing: ReactNode = (() => {
    if (variant === "summary") return null;
    return (
      <ChevronRight className={cn("h-5 w-5", variantIconColor[variant])} />
    );
  })();

  const Tag = isInteractive ? "button" : "div";

  return (
    <Tag
      type={isInteractive ? "button" : undefined}
      onClick={isInteractive ? handleClick : undefined}
      className={cn(
        "flex h-[66px] w-full items-center gap-3 rounded-[var(--radius)] px-4 text-left",
        variantSurface[variant],
        isInteractive && "press-effect",
        variant === "locked" && "cursor-not-allowed",
        className,
      )}
    >
      {icon ? (
        <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center", variantIconColor[variant])}>
          {icon}
        </span>
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className={cn(
            "font-display text-[16px] font-bold leading-[20px] truncate",
            variantTitleColor[variant],
          )}
        >
          {title}
        </span>
        {subtitle ? (
          <span className="font-sans text-[12px] font-normal leading-[16px] text-finery-textSecondary truncate">
            {subtitle}
          </span>
        ) : null}
      </span>

      <span className="flex shrink-0 items-center">
        {trailing !== undefined ? trailing : defaultTrailing}
      </span>
    </Tag>
  );
}