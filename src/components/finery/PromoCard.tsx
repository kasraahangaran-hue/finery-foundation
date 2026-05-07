import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";
import type { PromoData } from "@/data/promos";

interface PromoCardProps {
  promo: PromoData;
  selected: boolean;
  onToggle: () => void;
  onViewDetails: () => void;
}

/**
 * PromoCard — fixed-width 179px tile used inside a horizontal carousel.
 * Tap whole card to toggle selection; tap "View Details" to open sheet.
 * Selected state: light teal bg + filled "Applied" pill.
 */
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
      onClick={handleToggle}
      className={cn(
        "w-[179px] shrink-0 cursor-pointer rounded-[10px] border p-3 transition-colors",
        selected
          ? "border-finery-purple-400 bg-[#E8F5F2]"
          : "border-finery-purple-400/20 bg-white/60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-display text-[13px] font-bold leading-[16px] text-finery-purple-400">
            {promo.code}
          </span>
          <span className="text-[11px] leading-[14px] text-finery-purple-400/70">
            {promo.subtitle}
          </span>
          <button
            type="button"
            onClick={handleDetails}
            className="mt-1 self-start text-[11px] leading-[14px] text-finery-purple-400 underline"
          >
            View Details
          </button>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors",
            selected
              ? "bg-finery-purple-400 text-finery-beige-100"
              : "border border-finery-purple-400 text-finery-purple-400",
          )}
        >
          {selected ? "Applied" : "Apply"}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: Math.min(promo.total, 5) }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 w-3 rounded-full",
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