import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "@/stores/orderStore";
import { FineryWidgetRow, type FineryWidgetRowState } from "@/components/finery/FineryWidgetRow";
import { FineryButton } from "@/components/finery/FineryButton";
import { SelectAddressSheet } from "@/components/finery/SelectAddressSheet";
import { DeliveryTimesSheet } from "@/components/finery/DeliveryTimesSheet";
import { useOrderChrome } from "@/components/primitives/OrderShell";
import { summarizeAddress } from "@/lib/addressFormatting";
import { haptics } from "@/utils/haptics";

const DELIVERY_COPY =
  "After assessment, our team will call you to discuss the cleaning process and the estimated time for delivery";

export default function OrderStep1() {
  const navigate = useNavigate();

  const addresses = useOrderStore((s) => s.addresses);
  const selectedAddressId = useOrderStore((s) => s.selectedAddressId);
  const pickupSlot = useOrderStore((s) => s.pickupSlot);
  const deliveryTimesAcknowledged = useOrderStore((s) => s.deliveryTimesAcknowledged);

  const selectedAddress =
    selectedAddressId != null
      ? addresses.find((a) => a.id === selectedAddressId) ?? null
      : null;

  const hasAddress = Boolean(selectedAddress);
  const hasPickup = Boolean(pickupSlot);
  const hasDelivery = deliveryTimesAcknowledged;

  const addressState: FineryWidgetRowState = hasAddress ? "populated" : "current";
  const pickupState: FineryWidgetRowState = !hasAddress ? "disabled" : "populated";
  const deliveryState: FineryWidgetRowState = !hasAddress
    ? "disabled"
    : hasDelivery
      ? "populated"
      : "current";

  const allComplete =
    addressState === "populated" && pickupState === "populated" && deliveryState === "populated";

  const addressSubtitle = selectedAddress ? summarizeAddress(selectedAddress) : undefined;
  const pickupSubtitle = pickupSlot ? `${pickupSlot.date}, ${pickupSlot.window}` : undefined;
  const deliverySubtitle = hasDelivery ? DELIVERY_COPY : undefined;

  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [deliverySheetOpen, setDeliverySheetOpen] = useState(false);

  const onAddressTap = () => {
    if (addresses.length === 0) {
      console.log("[OrderStep1] address tap (no saved) — would navigate to /address/map");
    } else {
      setAddressSheetOpen(true);
    }
  };
  const onPickupTap = () => {
    console.log("[OrderStep1] pickup tap — would open Pickup bottom sheet");
  };
  const onDeliveryTap = () => {
    setDeliverySheetOpen(true);
  };

  const onBack = () => {
    haptics.light();
    console.log("[OrderStep1] back tap — would exit Finery flow to customer app");
  };

  const onContinue = () => {
    if (!allComplete) return;
    haptics.medium();
    console.log("[OrderStep1] continue tap — would navigate to /order/instructions");
    navigate("/order/instructions");
  };

  useOrderChrome({
    title: "The Finery® Order",
    step: 1,
    totalSteps: 3,
    onBack,
    ctaKey: `step1-${allComplete ? "active" : "inactive"}`,
    cta: (
      <FineryButton disabled={!allComplete} onClick={onContinue} className="w-full">
        {allComplete ? "Continue to Order" : "Continue"}
      </FineryButton>
    ),
  });

  return (
    <>
      <div className="mt-[22px] flex flex-col">
        <FineryWidgetRow state={addressState} icon="address" title={hasAddress ? "Address" : "Add Address"} subtitle={addressSubtitle} onPress={onAddressTap} />
        <FineryWidgetRow state={pickupState} icon="pickup" title={hasPickup ? "Pickup in Person" : "Schedule your collection"} subtitle={pickupSubtitle} onPress={onPickupTap} />
        <FineryWidgetRow state={deliveryState} icon="delivery" title={hasDelivery ? "Delivery" : "View Delivery Times"} subtitle={deliverySubtitle} onPress={onDeliveryTap} />
      </div>

      <SelectAddressSheet open={addressSheetOpen} onOpenChange={setAddressSheetOpen} />
      <DeliveryTimesSheet open={deliverySheetOpen} onOpenChange={setDeliverySheetOpen} />
    </>
  );
}