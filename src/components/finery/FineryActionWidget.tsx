import { Plus, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";

type FineryActionWidgetAction = "plus" | "edit";

interface FineryActionWidgetProps {
  icon: ReactNode;
  title: string;
  subtitle?: ReactNode;
  action?: FineryActionWidgetAction;
  onPress?: () => void;
  className?: string;
}

export function FineryActionWidget({
  icon,
  title,
  subtitle,
  action = "plus",
  onPress,
  className,
}: FineryActionWidgetProps) {
  const isInteractive = Boolean(onPress);

  const handlePress = () => {
    if (!isInteractive) return;
    haptics.light();
    onPress?.();
  };

  const Tag = isInteractive ? "button" : "div";
  const ActionIcon = action === "plus" ? Plus : Pencil;

  return (
    <Tag
      type={isInteractive ? "button" : undefined}
      onClick={isInteractive ? handlePress : undefined}
      className={cn(
        "flex w-full items-center gap-4 bg-finery-beige-200 px-6 py-[13px] text-left",
        isInteractive && "press-effect",
        className,
      )}
    >
      <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center text-finery-purple-400">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-display text-[16px] font-bold leading-[17px] tracking-[0.4px] text-finery-purple-400">
          {title}
        </span>
        {subtitle ? (
          <span className="font-sans text-[12px] font-light leading-[18px] tracking-[0.1px] text-finery-textSecondary">
            {subtitle}
          </span>
        ) : null}
      </span>
      <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center text-finery-purple-400">
        <ActionIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    </Tag>
  );
}