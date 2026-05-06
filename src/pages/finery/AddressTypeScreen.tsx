import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "@/stores/orderStore";
import { haptics } from "@/utils/haptics";
import { AddressTypeTile } from "@/components/finery/AddressTypeTile";
import { FineryButton } from "@/components/finery/FineryButton";
import type { AddressType } from "@/stores/orderStore";

const TYPES: AddressType[] = ["office", "hotel", "villa", "apartment"];

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
    <div className="flex h-[100dvh] flex-col bg-finery-beige-100">
      {/* Back button */}
      <div className="px-4 pt-[max(env(safe-area-inset-top),1.5rem)]">
        <FineryButton variant="tiny" onClick={onBack} />
      </div>

      {/* Title + grid */}
      <div className="flex flex-1 flex-col items-center px-6 pt-6">
        <h1 className="font-display text-[20px] font-bold leading-7 text-finery-purple-400">
          Select Address Type
        </h1>

        <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-4">
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

      {/* Footer */}
      <div className="px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
        <FineryButton
          className="w-full"
          disabled={!selectedType}
          onClick={onContinue}
        >
          Continue
        </FineryButton>
      </div>
    </div>
  );
}