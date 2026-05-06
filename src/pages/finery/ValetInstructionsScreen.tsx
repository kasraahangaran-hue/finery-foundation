import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Package } from "lucide-react";
import { FineryButton } from "@/components/finery/FineryButton";
import { FineryRadio } from "@/components/finery/FineryRadio";
import {
  useOrderStore,
  type ValetPickupPreference,
  type ValetDeliveryPreference,
} from "@/stores/orderStore";
import { haptics } from "@/utils/haptics";

const PICKUP_OPTIONS: { value: ValetPickupPreference; label: string }[] = [
  { value: "no_preference", label: "No Preference" },
  { value: "ring_doorbell", label: "Ring the door" },
  { value: "knock_door", label: "Knock on the door" },
  { value: "do_not_disturb_bags_outside", label: "Do not disturb, bags outside" },
  { value: "call_when_arrive", label: "Call me when you arrive" },
];

const DELIVERY_OPTIONS: { value: ValetDeliveryPreference; label: string }[] = [
  { value: "no_preference", label: "No Preference" },
  { value: "hang_door_handle", label: "Hang on door handle" },
  { value: "at_concierge", label: "At concierge / reception" },
  { value: "knock_door", label: "Knock the door" },
  { value: "call_when_arrive", label: "Call me when you arrive" },
];

export default function ValetInstructionsScreen() {
  const navigate = useNavigate();

  const savedPickup = useOrderStore((s) => s.valetPickupPreference);
  const savedDelivery = useOrderStore((s) => s.valetDeliveryPreference);
  const setValetPreferences = useOrderStore((s) => s.setValetPreferences);

  const [pickup, setPickup] = useState(savedPickup);
  const [delivery, setDelivery] = useState(savedDelivery);

  const onBack = () => {
    haptics.light();
    navigate(-1);
  };

  const onApply = () => {
    haptics.medium();
    setValetPreferences(pickup, delivery);
    navigate(-1);
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-finery-beige-200">
      {/* Header */}
      <header className="shrink-0">
        <div className="px-6 pt-[max(env(safe-area-inset-top),24px)] pb-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="press-effect -ml-1 p-1">
              <ArrowLeft className="h-5 w-5 text-finery-purple-400" />
            </button>
            <h1 className="font-display text-[18px] font-bold leading-[22px] tracking-[0.4px] text-finery-purple-400">
              Valet Instructions
            </h1>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto overscroll-contain px-6">
        {/* Pickup section */}
        <div className="mt-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-finery-purple-400">
              <Truck className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-[16px] font-bold leading-[20px] tracking-[0.4px] text-finery-purple-400">
                Get notified at pickup
              </span>
              <span className="mt-0.5 text-[12px] font-light leading-[18px] tracking-[0.1px] text-finery-textSecondary">
                Do you have any pickup instructions?
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-col">
            {PICKUP_OPTIONS.map((opt) => (
              <FineryRadio
                key={opt.value}
                label={opt.label}
                selected={pickup === opt.value}
                onSelect={() => setPickup(opt.value)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-finery-disabledBg" />

        {/* Delivery section */}
        <div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-finery-purple-400">
              <Package className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-[16px] font-bold leading-[20px] tracking-[0.4px] text-finery-purple-400">
                Get notified at delivery
              </span>
              <span className="mt-0.5 text-[12px] font-light leading-[18px] tracking-[0.1px] text-finery-textSecondary">
                Do you have any delivery instructions?
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-col">
            {DELIVERY_OPTIONS.map((opt) => (
              <FineryRadio
                key={opt.value}
                label={opt.label}
                selected={delivery === opt.value}
                onSelect={() => setDelivery(opt.value)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 bg-finery-beige-300 px-6 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
        <FineryButton onClick={onApply} className="w-full">
          Apply
        </FineryButton>
      </footer>
    </div>
  );
}