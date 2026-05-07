import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Calendar, Package, Tag, CreditCard, Pencil } from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import { useOrderChrome } from "@/components/primitives/OrderShell";
import { FineryButton } from "@/components/finery/FineryButton";
import { PromoCard } from "@/components/finery/PromoCard";
import { PromoDetailsSheet } from "@/components/finery/PromoDetailsSheet";
import { AVAILABLE_PROMOS, calculatePromoDiscount, type PromoData } from "@/data/promos";
import { summarizeAddress } from "@/lib/addressFormatting";
import { haptics } from "@/utils/haptics";
import applePayWordmarkUrl from "@/assets/icons/apple-pay-wordmark.svg";

const DELIVERY_DISCLAIMER =
  "After assessment, our team will call you to discuss the cleaning process and the estimated time for delivery";
const PAYMENT_SUBTITLE = "We will charge your card after sorting your items at the facility";

const STUB_ITEMS_TOTAL = 0;

interface SummaryRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function SummaryRow({ icon, title, subtitle }: SummaryRowProps) {
  return (
    <div className="flex gap-3 py-3">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center text-finery-purple-400">
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-display text-[14px] font-bold leading-[18px] text-finery-purple-400">
          {title}
        </span>
        <span className="text-[12px] leading-[16px] text-finery-purple-400/70">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="font-display text-[16px] font-bold leading-[20px] tracking-[0.3px] text-finery-purple-400">
      {children}
    </h2>
  );
}

export default function LastStepScreen() {
  const navigate = useNavigate();

  const addresses = useOrderStore((s) => s.addresses);
  const selectedAddressId = useOrderStore((s) => s.selectedAddressId);
  const pickupSlot = useOrderStore((s) => s.pickupSlot);

  const selectedAddress = useMemo(
    () =>
      selectedAddressId != null
        ? addresses.find((a) => a.id === selectedAddressId) ?? null
        : null,
    [addresses, selectedAddressId],
  );

  const addressSubtitle = selectedAddress ? summarizeAddress(selectedAddress) : "—";
  const pickupSubtitle = pickupSlot ? `${pickupSlot.date}, ${pickupSlot.window}` : "—";

  const [selectedPromoCode, setSelectedPromoCode] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [detailsPromo, setDetailsPromo] = useState<PromoData | null>(null);

  const promoDiscount = calculatePromoDiscount(selectedPromoCode, STUB_ITEMS_TOTAL);
  void promoDiscount;

  const togglePromo = (code: string) => {
    setSelectedPromoCode((curr) => (curr === code ? null : code));
  };

  const tryApplyTypedCode = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const match = AVAILABLE_PROMOS.find((p) => p.code === code);
    if (match) {
      haptics.medium();
      setSelectedPromoCode(match.code);
      setPromoInput("");
    } else {
      haptics.light();
    }
  };

  const onBack = () => {
    haptics.light();
    navigate("/order/instructions");
  };

  const onPay = () => {
    haptics.medium();
    console.log("[LastStep] Pay tap — placing order with promo:", selectedPromoCode);
    navigate("/order/confirmed");
  };

  const onEditPayment = () => {
    haptics.light();
    console.log("[LastStep] Edit payment tap — native flow, out of prototype scope");
  };

  useOrderChrome({
    title: "Last Step",
    step: 3,
    totalSteps: 3,
    onBack,
    cta: (
      <FineryButton onClick={onPay} className="flex-1 gap-2">
        <span className="flex items-center gap-2">
          Pay with
          <img src={applePayWordmarkUrl} alt="Apple Pay" className="h-5" />
        </span>
      </FineryButton>
    ),
  });

  return (
    <>
      <div className="flex flex-col gap-6 px-6 pb-8 pt-2">
        {/* Order Summary */}
        <section className="flex flex-col gap-1">
          <SectionTitle>Order Summary</SectionTitle>
          <SummaryRow
            icon={<Home className="h-4 w-4" />}
            title="Address"
            subtitle={addressSubtitle}
          />
          <SummaryRow
            icon={<Calendar className="h-4 w-4" />}
            title="Collection in Person"
            subtitle={pickupSubtitle}
          />
          <SummaryRow
            icon={<Package className="h-4 w-4" />}
            title="Delivery"
            subtitle={DELIVERY_DISCLAIMER}
          />
        </section>

        {/* Promocode */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <SectionTitle>Promocode</SectionTitle>
            <Tag className="h-4 w-4 text-finery-purple-400" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              {AVAILABLE_PROMOS.map((promo) => (
                <PromoCard
                  key={promo.code}
                  promo={promo}
                  selected={selectedPromoCode === promo.code}
                  onToggle={() => togglePromo(promo.code)}
                  onViewDetails={() => setDetailsPromo(promo)}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-[10px] border border-finery-purple-400/20 bg-white/60 px-4 py-3">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && promoInput.trim()) {
                    e.preventDefault();
                    tryApplyTypedCode();
                  }
                }}
                placeholder="Type your promocode here"
                className="flex-1 bg-transparent text-[14px] leading-[20px] text-finery-purple-400 placeholder:text-[#c3c8db] focus:outline-none"
              />
              {promoInput.trim() ? (
                <button type="button" onClick={tryApplyTypedCode} className="press-effect text-[13px] font-bold text-finery-purple-400">
                  Apply
                </button>
              ) : null}
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="flex flex-col gap-3">
          <SectionTitle>Payment Method</SectionTitle>
          <div className="rounded-[10px] border border-finery-purple-400/20 bg-white/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-finery-purple-400" />
                <span className="font-display text-[14px] font-bold text-finery-purple-400">
                  Apple Pay
                </span>
              </div>
              <button type="button" onClick={onEditPayment} className="press-effect">
                <Pencil className="h-4 w-4 text-finery-purple-400/50" />
              </button>
            </div>
            <p className="mt-2 text-[12px] leading-[16px] text-finery-purple-400/60">
              {PAYMENT_SUBTITLE}
            </p>
          </div>
        </section>
      </div>

      <PromoDetailsSheet
        open={detailsPromo !== null}
        onOpenChange={(open) => {
          if (!open) setDetailsPromo(null);
        }}
        promo={detailsPromo}
      />
    </>
  );
}