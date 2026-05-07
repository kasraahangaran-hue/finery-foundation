import { BottomSheetShell } from "@/components/primitives/BottomSheetShell";
import type { PromoData } from "@/data/promos";

const PROMO_TERMS = [
  "Promo can be used only on new orders placed after the date of issue.",
  "Discount applies to the total before delivery fee and tip.",
  "One promo code can be applied per order.",
  "Promo cannot be combined with other offers or credits.",
  "Promo expires 30 days from the date of issue unless otherwise stated.",
  "The Finery reserves the right to modify or revoke the promo at any time.",
];

interface PromoDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promo: PromoData | null;
}

export function PromoDetailsSheet({ open, onOpenChange, promo }: PromoDetailsSheetProps) {
  if (!promo) return null;
  return (
    <BottomSheetShell
      open={open}
      onOpenChange={onOpenChange}
      title={promo.code}
      footer="none"
    >
      <div className="flex flex-col gap-4 pb-6">
        <p className="text-[14px] leading-[20px] text-finery-purple-400/80">
          {promo.subtitle}
        </p>
        <h3 className="font-display text-[14px] font-bold text-finery-purple-400">
          Terms &amp; Conditions
        </h3>
        <ul className="flex flex-col gap-2">
          {PROMO_TERMS.map((term, i) => (
            <li key={i} className="text-[12px] leading-[18px] text-finery-purple-400/70">
              {term}
            </li>
          ))}
        </ul>
      </div>
    </BottomSheetShell>
  );
}