import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RawSvg } from "@/components/finery/RawSvg";
import addUrl from "@/assets/icons/finery/add.svg?raw";
import editUrl from "@/assets/icons/finery/edit.svg?raw";
import deleteUrl from "@/assets/icons/finery/delete.svg?raw";
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

  const navigate = useNavigate();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const onAddNew = () => {
    haptics.light();
    setPendingAddressDraft(null);
    onOpenChange(false);
    navigate("/address/map");
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
    onOpenChange(false);
    navigate("/address/map");
  };

  return (
    <>
      <BottomSheetShell
        open={open}
        onOpenChange={onOpenChange}
        title="Select Address"
        footer="none"
        titleAccessory={
          <button
            type="button"
            onClick={onAddNew}
            className="press-effect flex items-center gap-2"
          >
            <RawSvg svg={addUrl} className="h-4 w-4" />
            <span className="font-display text-[14px] font-bold leading-[18px] tracking-[0.4px] text-finery-purple-400">
              Add New Address
            </span>
          </button>
        }
      >
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

  const valueClass = selected
    ? "font-display text-[15px] font-bold leading-[20px] tracking-[0.2px] text-finery-purple-400"
    : "font-display text-[14px] font-bold leading-[18px] tracking-[0.4px] text-finery-purple-400";

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
        "press-effect relative cursor-pointer border px-4 py-3",
        selected
          ? "border-finery-purple-400 bg-finery-teal-300"
          : "border-transparent bg-white",
      )}
    >
      <div className="flex items-start gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-display text-[12px] font-bold leading-[14px] tracking-[0.4px] text-[#585871]">
              {lines.primaryLabel}
            </p>
            <p className={valueClass}>{lines.primaryValue}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-display text-[12px] font-bold leading-[14px] tracking-[0.4px] text-[#585871]">
              {lines.secondaryLabel}
            </p>
            <p className={valueClass}>{lines.secondaryValue}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-start gap-5 self-stretch">
          {!selected && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                haptics.warning();
                onDelete();
              }}
              aria-label="Delete address"
              className="press-effect flex h-8 w-8 -m-2 items-center justify-center"
            >
              <RawSvg svg={deleteUrl} className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="Edit address"
            className="press-effect flex h-8 w-8 -m-2 items-center justify-center"
          >
            <RawSvg svg={editUrl} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}