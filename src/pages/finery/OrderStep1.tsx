import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import { FineryStepper } from "@/components/finery/FineryStepper";
import { FineryWidgetRow, type FineryWidgetRowState } from "@/components/finery/FineryWidgetRow";
import { FineryButton } from "@/components/finery/FineryButton";
import { useOrderChrome } from "@/components/primitives/OrderShell";
import { addressCardLines } from "@/lib/addressFormatting";
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
  const pickupState: FineryWidgetRowState = !hasAddress
    ? "disabled"
    : hasPickup
      ? "populated"
      : "current";
  const deliveryState: FineryWidgetRowState = !hasPickup
    ? "disabled"
    : hasDelivery
      ? "populated"
      : "current";

  const allComplete =
    addressState === "populated" && pickupState === "populated" && deliveryState === "populated";

  const addressSubtitle = selectedAddress ? addressCardLines(selectedAddress).line1 : undefined;
  const pickupSubtitle = pickupSlot ? `${pickupSlot.date}, ${pickupSlot.window}` : undefined;
  const deliverySubtitle = hasDelivery ? DELIVERY_COPY : undefined;

  const onAddressTap = () => {
    if (addresses.length === 0) {
      console.log("[OrderStep1] address tap — would navigate to /address/map");
    } else {
      console.log("[OrderStep1] address tap — would open SelectAddressSheet");
    }
  };
  const onPickupTap = () => {
    console.log("[OrderStep1] pickup tap — would open Pickup bottom sheet");
  };
  const onDeliveryTap = () => {
    console.log("[OrderStep1] delivery tap — would open Delivery Times bottom sheet");
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
    footerKey: `step1-${allComplete ? "active" : "inactive"}`,
    footer: (
      <div className="flex w-full items-center gap-2">
        <FineryButton variant="tiny" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </FineryButton>
        <FineryButton disabled={!allComplete} onClick={onContinue}>
          {allComplete ? "Continue to Order" : "Continue"}
        </FineryButton>
      </div>
    ),
  });

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-[18px]">
        <h1 className="font-display text-[26px] font-bold leading-[30px] text-finery-purple-400">
          The Finery® Order
        </h1>

        <div className="mt-[13px]">
          <FineryStepper step={1} />
        </div>
      </div>

      <div className="mt-[22px] flex flex-col">
        <FineryWidgetRow state={addressState} icon="address" title={hasAddress ? "Address" : "Add Address"} subtitle={addressSubtitle} onPress={onAddressTap} />
        <FineryWidgetRow state={pickupState} icon="pickup" title={hasPickup ? "Pickup in Person" : "Schedule your collection"} subtitle={pickupSubtitle} onPress={onPickupTap} />
        <FineryWidgetRow state={deliveryState} icon="delivery" title={hasDelivery ? "Delivery" : "View Delivery Times"} subtitle={deliverySubtitle} onPress={onDeliveryTap} />
      </div>
    </div>
  );
}