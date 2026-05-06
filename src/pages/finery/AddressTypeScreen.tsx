import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "@/stores/orderStore";
import { haptics } from "@/utils/haptics";
import { AddressTypeTile } from "@/components/finery/AddressTypeTile";
import { FineryButton } from "@/components/finery/FineryButton";
import type { AddressType } from "@/stores/orderStore";

const TYPES: AddressType[] = ["apartment", "villa", "hotel", "office"];

export default function AddressTypeScreen() {
  const navigate = useNavigate();
  const pendingDraft = useOrderStore((s) => s.pendingAddressDraft);
  const setPendingAddressDraft = useOrderStore(
    (s) => s.setPendingAddressDraft,
  );

  const [selectedType, setSelectedType] = useState<AddressType | null>(
    pendingDraft?.type ?? null,
  );

  useEffect(() => {
    if (!pendingDraft) {
      navigate("/address/map", { replace: true });
    }
  }, [pendingDraft, navigate]);

  if (!pendingDraft) return null;

  const onSelect = (type: AddressType) => {
    setSelectedType(type);
  };

  const onBack = () => {
    haptics.light();
    navigate("/address/map");
  };

  const onContinue = () => {
    if (!selectedType) return;
    haptics.medium();
    const fields =
      pendingDraft.type === selectedType ? pendingDraft.fields : undefined;
    setPendingAddressDraft({
      ...pendingDraft,
      type: selectedType,
      fields,
    });
    navigate("/address/details");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-finery-beige-200">
      {/* Title + grid (no back button at top — back lives in footer) */}
      <div className="flex-1 px-6 pt-[max(env(safe-area-inset-top),1.5rem)] pb-4">
        <h1 className="mb-6 font-display text-[18px] font-bold leading-[21px] tracking-[0.4px] text-finery-purple-400">
          Select Address Type
        </h1>

        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((type) => (
            <AddressTypeTile
              key={type}
              type={type}
              selected={selectedType === type}
              onSelect={() => onSelect(type)}
              variant="card"
            />
          ))}
        </div>
      </div>

      {/* Footer — back button + continue CTA inline */}
      <div className="flex items-center gap-2 bg-finery-beige-200 px-6 pt-3 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
        <FineryButton variant="tiny" onClick={onBack} aria-label="Back" />
        <div className="flex-1">
          <FineryButton
            onClick={onContinue}
            disabled={!selectedType}
            className="w-full"
          >
            Continue
          </FineryButton>
        </div>
      </div>
    </div>
  );
}