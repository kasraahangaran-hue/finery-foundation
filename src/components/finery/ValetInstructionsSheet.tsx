import { useEffect, useState } from "react";
import { Truck, Package } from "lucide-react";
import { BottomSheetShell } from "@/components/primitives/BottomSheetShell";
import { FineryRadio } from "@/components/finery/FineryRadio";
import {
  type ValetPickupPreference,
  type ValetDeliveryPreference,
} from "@/stores/orderStore";

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
  { value: "call_when_arrive", label: "Call when you arrive" },
];

interface ValetInstructionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPickup: ValetPickupPreference;
  initialDelivery: ValetDeliveryPreference;
  onApply: (pickup: ValetPickupPreference, delivery: ValetDeliveryPreference) => void;
}

export function ValetInstructionsSheet({
  open,
  onOpenChange,
  initialPickup,
  initialDelivery,
  onApply,
}: ValetInstructionsSheetProps) {
  const [pickup, setPickup] = useState(initialPickup);
  const [delivery, setDelivery] = useState(initialDelivery);

  useEffect(() => {
    if (open) {
      setPickup(initialPickup);
      setDelivery(initialDelivery);
    }
  }, [open, initialPickup, initialDelivery]);

  const handleApply = () => {
    onApply(pickup, delivery);
    onOpenChange(false);
  };

  return (
    <BottomSheetShell
      open={open}
      onOpenChange={onOpenChange}
      title="Valet Instructions"
      footer="apply-only"
      primaryLabel="Apply"
      onPrimary={handleApply}
    >
      {/* Pickup section */}
      <div>
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
    </BottomSheetShell>
  );
}