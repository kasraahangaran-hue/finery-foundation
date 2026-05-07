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
    <div
      className={cn(
        "rounded-[10px] border bg-white/60 p-4 transition-colors",
        selected ? "border-finery-purple-400" : "border-finery-purple-400/20",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-display text-[14px] font-bold leading-[18px] text-finery-purple-400">
            {promo.code}
          </span>
          <span className="text-[12px] leading-[16px] text-finery-purple-400/70">
            {promo.subtitle}
          </span>
          <button
            type="button"
            onClick={handleDetails}
            className="mt-1 self-start text-[12px] leading-[16px] text-finery-purple-400 underline"
          >
            View Details
          </button>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            "press-effect shrink-0 rounded-[8px] px-4 py-1.5 text-[12px] font-bold transition-colors",
            selected
              ? "bg-finery-purple-400 text-finery-beige-100"
              : "border border-finery-purple-400 text-finery-purple-400",
          )}
        >
          {selected ? "Applied" : "Apply"}
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: Math.min(promo.total, 5) }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-4 rounded-full",
                i < promo.used ? "bg-finery-purple-400" : "bg-finery-purple-400/20",
              )}
            />
          ))}
        </div>
        <span className="text-[11px] text-finery-purple-400/50">
          {promo.used}/{promo.total}
        </span>
      </div>
    </div>
  );
}