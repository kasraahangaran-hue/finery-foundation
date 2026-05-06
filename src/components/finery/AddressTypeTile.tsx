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
          "press-effect flex h-[77px] w-[78px] shrink-0 flex-col items-center justify-center gap-1 border p-[9px] transition-colors",
          selected
            ? "border-finery-purple-400 bg-finery-teal-300"
            : "border-[#F2F3F8] bg-white",
        )}
        aria-pressed={selected}
      >
        <span className="font-display text-[12px] font-bold leading-[14px] tracking-[0.4px] text-finery-purple-400">
          {label}
        </span>
        <RawSvg svg={iconRaw} className="h-[34px] w-[34px] select-none" />
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
      <RawSvg svg={iconRaw} className="h-16 w-16 select-none" />
    </button>
  );
}