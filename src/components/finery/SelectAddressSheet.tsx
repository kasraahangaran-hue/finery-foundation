import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import type { Address } from "@/stores/orderStore";
import { BottomSheetShell } from "@/components/primitives/BottomSheetShell";
import { DeleteAddressDialog } from "@/components/finery/DeleteAddressDialog";
import { addressCardLines } from "@/lib/addressFormatting";
import { haptics } from "@/utils/haptics";
import { cn } from "@/lib/utils";

interface SelectAddressSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SelectAddressSheet({
  open,
  onOpenChange,
}: SelectAddressSheetProps) {
  const addresses = useOrderStore((s) => s.addresses);
  const selectedAddressId = useOrderStore((s) => s.selectedAddressId);
  const selectAddress = useOrderStore((s) => s.selectAddress);
  const setPendingAddressDraft = useOrderStore((s) => s.setPendingAddressDraft);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const onAddNew = () => {
    haptics.light();
    setPendingAddressDraft(null);
    console.log("[SelectAddressSheet] + Add New Address — would navigate to /address/map");
    onOpenChange(false);
  };

  const onSelect = (id: string) => {
    haptics.light();
    selectAddress(id);
    onOpenChange(false);
  };

  const onEdit = (address: Address) => {
    haptics.light();
    setPendingAddressDraft({
      id: address.id,
      lat: address.lat,
      lng: address.lng,
      formattedAddress: address.formattedAddress,
      type: address.type,
      fields: address.fields,
    });
    console.log("[SelectAddressSheet] edit — would navigate to /address/map (edit mode)");
    onOpenChange(false);
  };

  return (
    <>
      <BottomSheetShell
        open={open}
        onOpenChange={onOpenChange}
        title="Edit Address"
        footer="none"
      >
        <div className="flex flex-col gap-3">
          <button
            onClick={onAddNew}
            className="press-effect flex items-center gap-1 self-end font-sans text-[14px] font-medium text-finery-purple-400 underline"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </button>

          <div className="flex flex-col gap-3">
            {addresses.map((address) => (
              <AddressRow
                key={address.id}
                address={address}
                selected={address.id === selectedAddressId}
                onSelect={() => onSelect(address.id)}
                onEdit={() => onEdit(address)}
                onDelete={() => setPendingDeleteId(address.id)}
              />
            ))}
          </div>
        </div>
      </BottomSheetShell>

      <DeleteAddressDialog
        open={pendingDeleteId != null}
        onOpenChange={(o) => {
          if (!o) setPendingDeleteId(null);
        }}
        onConfirm={() => {
          if (pendingDeleteId) {
            useOrderStore.getState().deleteAddress(pendingDeleteId);
            setPendingDeleteId(null);
          }
        }}
      />
    </>
  );
}

interface AddressRowProps {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function AddressRow({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: AddressRowProps) {
  const lines = addressCardLines(address);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "press-effect relative cursor-pointer border bg-white p-4",
        selected
          ? "border-finery-purple-400 bg-finery-teal-300"
          : "border-finery-disabledBg",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[11px] font-light tracking-[0.3px] text-finery-textSecondary">
            {lines.primaryLabel}
          </span>
          <span className="font-sans text-[14px] font-semibold text-finery-purple-400">
            {lines.primaryValue}
          </span>
          <span className="mt-1 font-sans text-[11px] font-light tracking-[0.3px] text-finery-textSecondary">
            {lines.secondaryLabel}
          </span>
          <span className="font-sans text-[14px] font-normal text-finery-purple-400">
            {lines.secondaryValue}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!selected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                haptics.warning();
                onDelete();
              }}
              aria-label="Delete address"
              className="press-effect flex h-8 w-8 items-center justify-center"
            >
              <Trash2 className="h-4 w-4 text-finery-purple-400" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="Edit address"
            className="press-effect flex h-8 w-8 items-center justify-center"
          >
            <Pencil className="h-4 w-4 text-finery-purple-400" />
          </button>
        </div>
      </div>
    </div>
  );
}