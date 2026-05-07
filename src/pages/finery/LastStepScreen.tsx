import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RawSvg } from "@/components/finery/RawSvg";
import addressUrl from "@/assets/icons/finery/address.svg?raw";
import pickupUrl from "@/assets/icons/finery/pickup.svg?raw";
import deliveryUrl from "@/assets/icons/finery/delivery.svg?raw";
import tagUrl from "@/assets/icons/finery/tag.svg?raw";
import creditCardUrl from "@/assets/icons/finery/credit-card.svg?raw";
import editUrl from "@/assets/icons/finery/edit.svg?raw";
import { useOrderStore } from "@/stores/orderStore";
import { useOrderChrome } from "@/components/primitives/OrderShell";
import { PromoCard } from "@/components/finery/PromoCard";
import { PromoDetailsSheet } from "@/components/finery/PromoDetailsSheet";
import { PaymentMethodSheet } from "@/components/finery/PaymentMethodSheet";
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
    <div className="flex items-start gap-4 px-6 py-[13px]">
      <div className="h-6 w-6 shrink-0 text-finery-purple-400">
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-display text-[16px] font-bold leading-[17px] tracking-[0.4px] text-finery-purple-400">
          {title}
        </span>
        <span className="text-[12px] font-light leading-[18px] tracking-[0.1px] text-finery-textSecondary">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

interface SectionTitleProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function SectionTitle({ icon, children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-[6px]">
      {icon ? <span className="shrink-0 text-finery-purple-400">{icon}</span> : null}
      <p className="font-display text-[18px] leading-none tracking-[0.4px] text-finery-purple-400">
        {children}
      </p>
    </div>
  );
}

export default function LastStepScreen() {
  const navigate = useNavigate();

  const addresses = useOrderStore((s) => s.addresses);
  const selectedAddressId = useOrderStore((s) => s.selectedAddressId);
  const pickupSlot = useOrderStore((s) => s.pickupSlot);
  const payment = useOrderStore((s) => s.payment);
  const isApplePay = payment?.method === "apple_pay";

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
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);

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
    setPaymentSheetOpen(true);
  };

  useOrderChrome({
    title: "Last Step",
    step: 3,
    totalSteps: 3,
    onBack,
    ctaKey: isApplePay ? "cta-apple-pay" : "cta-place-order",
    cta: isApplePay ? (
      <button
        type="button"
        onClick={onPay}
        className="press-effect flex h-[42px] w-full items-center justify-center gap-2 rounded-none bg-black"
      >
        <span className="font-display text-[14px] font-bold leading-[18px] tracking-[0.4px] text-white">Pay with</span>
        <img src={applePayWordmarkUrl} alt="Apple Pay" className="h-[20px] w-auto" />
      </button>
    ) : (
      <button
        type="button"
        onClick={onPay}
        className="press-effect flex h-[42px] w-full items-center justify-center rounded-none bg-finery-purple-400"
      >
        <span className="font-display text-[14px] font-bold leading-[18px] tracking-[0.4px] text-white">Place Order</span>
      </button>
    ),
  });

  return (
    <>
      <div className="flex flex-col gap-3 pb-6 stagger-children">
        {/* Order Summary */}
        <section className="flex flex-col">
          <SectionTitle>Order Summary</SectionTitle>
          <SummaryRow
            icon={<RawSvg svg={addressUrl} className="h-6 w-6 shrink-0" />}
            title="Address"
            subtitle={addressSubtitle}
          />
          <SummaryRow
            icon={<RawSvg svg={pickupUrl} className="h-6 w-6 shrink-0" />}
            title="Pick Up"
            subtitle={pickupSubtitle}
          />
          <SummaryRow
            icon={<RawSvg svg={deliveryUrl} className="h-6 w-6 shrink-0" />}
            title="Delivery"
            subtitle={DELIVERY_DISCLAIMER}
          />
        </section>

        {/* Promocode */}
        <section className="flex flex-col gap-3">
          <div className="mx-6 h-px bg-border" />
          <SectionTitle icon={<RawSvg svg={tagUrl} className="h-6 w-6 shrink-0" />}>Promocode</SectionTitle>

          <div className="flex flex-col gap-3">
            <div className="h-carousel flex items-stretch gap-2 overflow-x-auto px-6 pb-1">
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

            <div className="mx-6 flex items-center gap-2 rounded-[6px] border border-finery-purple-400 bg-white px-4 py-3">
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
          <div className="mx-6 h-px bg-border" />
          <SectionTitle>Payment Method</SectionTitle>
          <div className="px-6">
            <button
              type="button"
              onClick={onEditPayment}
              className="press-effect flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <RawSvg svg={creditCardUrl} className="h-6 w-6 shrink-0" />
                <span className="font-display text-[14px] font-bold text-finery-purple-400">
                  {isApplePay ? "Apple Pay" : `Credit Card •••• ${payment?.last4 ?? "4242"}`}
                </span>
              </div>
              <RawSvg svg={editUrl} className="h-4 w-4" />
            </button>
            <p className="mt-2 text-[12px] leading-[16px] text-finery-textSecondary">
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
      <PaymentMethodSheet open={paymentSheetOpen} onOpenChange={setPaymentSheetOpen} />
    </>
  );
}