import { RawSvg } from "@/components/finery/RawSvg";
import addressUrl from "@/assets/icons/finery/address.svg?raw";
import pickupUrl from "@/assets/icons/finery/pickup.svg?raw";
import deliveryUrl from "@/assets/icons/finery/delivery.svg?raw";
import addUrl from "@/assets/icons/finery/add.svg?raw";
import editUrl from "@/assets/icons/finery/edit.svg?raw";
import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";

/**
 * FineryWidgetRow — three-state row used on S1 Logistics screen.
 *
 * State model (matches Figma):
 *   - disabled:  blocked until prior row is populated. Grey (#DFDBDB) text+icon.
 *                bg = beige.200 (page bg). No trailing icon. Not tappable.
 *   - current:   the next thing for the user to do. Purple text+icon.
 *                bg = beige.300 (warm tint, draws the eye). Trailing `+`.
 *   - populated: data captured for this row. Purple text+icon.
 *                bg = beige.200 (page bg). Subtitle visible. Trailing pencil.
 */

export type FineryWidgetRowState = "disabled" | "current" | "populated";
export type FineryWidgetRowIcon = "address" | "pickup" | "delivery";

interface FineryWidgetRowProps {
  state: FineryWidgetRowState;
  icon: FineryWidgetRowIcon;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  className?: string;
}

const ICON_MAP: Record<FineryWidgetRowIcon, string> = {
  address: addressUrl,
  pickup: pickupUrl,
  delivery: deliveryUrl,
};

export function FineryWidgetRow({
  state,
  icon,
  title,
  subtitle,
  onPress,
  className,
}: FineryWidgetRowProps) {
  const isDisabled = state === "disabled";
  const isCurrent = state === "current";
  const isPopulated = state === "populated";
  const isInteractive = !isDisabled && Boolean(onPress);

  const handlePress = () => {
    if (!isInteractive) return;
    haptics.light();
    onPress?.();
  };

  const iconUrl = ICON_MAP[icon];
  const Tag = isInteractive ? "button" : "div";

  const bg = isCurrent ? "bg-finery-beige-300" : "bg-finery-beige-100";
  const fg = isDisabled ? "text-finery-disabledBg" : "text-finery-purple-400";
  const py = subtitle ? "py-[13px]" : "py-[22px]";

  const trailing = isCurrent ? (
    <RawSvg svg={addUrl} className="h-3.5 w-3.5" />
  ) : isPopulated ? (
    <RawSvg svg={editUrl} className="h-3.5 w-3.5" />
  ) : null;

  return (
    <Tag
      type={isInteractive ? "button" : undefined}
      onClick={isInteractive ? handlePress : undefined}
      className={cn(
        "flex w-full items-start gap-4 px-6 text-left",
        bg,
        py,
        isInteractive && "press-effect",
        className,
      )}
    >
      <RawSvg svg={iconUrl} className="mt-0.5 h-5 w-5 shrink-0" />

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={cn(
            "font-display text-[16px] font-bold leading-[17px] tracking-[0.4px] truncate",
            fg,
          )}
        >
          {title}
        </span>
        {subtitle ? (
          <span className="font-sans text-[12px] font-light leading-[18px] tracking-[0.1px] text-finery-textSecondary">
            {subtitle}
          </span>
        ) : null}
      </span>

      {trailing ? <span className="mt-0.5 flex h-[14px] w-[14px] shrink-0 items-center justify-center">{trailing}</span> : null}
    </Tag>
  );
}