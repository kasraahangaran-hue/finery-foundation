import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";
import type { PromoData } from "@/data/promos";

interface PromoCardProps {
  promo: PromoData;
  selected: boolean;
  onToggle: () => void;
  onViewDetails: () => void;
}

export function PromoCard({ promo, selected, onToggle, onViewDetails }: PromoCardProps) {
  const handleToggle = () => {
    haptics.light();
    onToggle();
  };

  const handleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.light();
    onViewDetails();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "flex w-[260px] shrink-0 flex-col press-effect rounded-[8px] border border-finery-purple-400 p-3 text-left transition-colors",
        selected ? "bg-finery-teal-300" : "bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-display text-[14px] font-bold leading-[16px] tracking-[0.4px] text-finery-purple-400">
            {promo.code}
          </span>
          <span className="font-display text-[12px] font-light leading-[16px] tracking-[0.3px] text-finery-purple-400 line-clamp-2">
            {promo.subtitle}
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={handleDetails}
            className="mt-1 self-start font-display text-[12px] font-light leading-[16px] tracking-[0.3px] text-finery-purple-400 underline"
          >
            View Details
          </span>
        </div>

        <span
          className={cn(
            "flex h-[26px] w-[64px] shrink-0 items-center justify-center rounded-[5px] border border-finery-purple-400 font-display text-[11px] font-medium tracking-[0.1px] transition-colors",
            selected
              ? "bg-finery-purple-400 text-finery-beige-100"
              : "text-finery-purple-400",
          )}
        >
          {selected ? "Applied" : "Apply"}
        </span>
      </div>

      <div className="mt-auto pt-2.5 flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: Math.min(promo.total, 5) }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-[7px] w-[7px] rounded-full",
                i < promo.used ? "bg-finery-purple-400" : "border border-finery-purple-400",
              )}
            />
          ))}
        </div>
        <span className="font-display text-[10px] font-light tracking-[0.3px] text-finery-purple-400">
          {promo.used}/{promo.total}
        </span>
      </div>
    </button>
  );
}
