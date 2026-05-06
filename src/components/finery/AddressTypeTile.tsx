import { cn } from "@/lib/utils";
import type { AddressType } from "@/stores/orderStore";
import { RawSvg } from "@/lib/RawSvg";
import { haptics } from "@/utils/haptics";

import addressOfficeRaw from "@/assets/icons/address-office.svg?raw";
import addressHotelRaw from "@/assets/icons/address-hotel.svg?raw";
import addressVillaRaw from "@/assets/icons/address-villa.svg?raw";
import addressApartmentRaw from "@/assets/icons/address-apartment.svg?raw";

const ICON_RAW_BY_TYPE: Record<AddressType, string> = {
  office: addressOfficeRaw,
  hotel: addressHotelRaw,
  villa: addressVillaRaw,
  apartment: addressApartmentRaw,
};

const LABEL_BY_TYPE: Record<AddressType, string> = {
  office: "Office",
  hotel: "Hotel",
  villa: "Villa",
  apartment: "Apartment",
};

interface AddressTypeTileProps {
  type: AddressType;
  selected: boolean;
  onSelect: () => void;
  variant: "card" | "chip";
}

export function AddressTypeTile({
  type,
  selected,
  onSelect,
  variant,
}: AddressTypeTileProps) {
  const iconRaw = ICON_RAW_BY_TYPE[type];
  const label = LABEL_BY_TYPE[type];

  const handleClick = () => {
    haptics.light();
    onSelect();
  };

  if (variant === "chip") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "press-effect flex shrink-0 items-center gap-2 border px-3 py-2 transition-colors",
          selected
            ? "border-finery-purple-400 bg-finery-purple-400 text-finery-beige-100"
            : "border-finery-disabledBg bg-finery-beige-100 text-finery-purple-400",
        )}
        aria-pressed={selected}
      >
        <RawSvg svg={iconRaw} className="h-5 w-5 shrink-0 select-none" />
        <span className="font-display text-[13px] font-bold">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "press-effect flex h-[157px] w-full flex-col items-center justify-center gap-4 bg-white p-[18px] transition-all",
        selected
          ? "border-2 border-finery-purple-400 shadow-md"
          : "border-2 border-transparent",
      )}
      aria-pressed={selected}
    >
      <span className="font-display text-[14px] font-bold leading-[18px] tracking-[0.4px] text-finery-purple-400">
        {label}
      </span>
      <RawSvg svg={iconRaw} className="h-[68px] w-[68px] select-none" />
    </button>
  );
}