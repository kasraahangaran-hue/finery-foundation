import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "@/stores/orderStore";
import { haptics } from "@/utils/haptics";
import { FineryButton } from "@/components/finery/FineryButton";
import { AddressTypeTile } from "@/components/finery/AddressTypeTile";
import type {
  Address,
  AddressType,
  HotelFields,
  VillaFields,
} from "@/stores/orderStore";

const TYPES: AddressType[] = ["apartment", "villa", "hotel", "office"];

const TYPE_TITLE: Record<AddressType, string> = {
  apartment: "Apartment Details",
  villa: "Villa Details",
  hotel: "Hotel Details",
  office: "Office Details",
};

const inputClass =
  "h-[46px] w-full rounded-[6px] border border-[#E8E1D6] bg-white px-4 font-sans text-[14px] font-light leading-[20px] tracking-[0.1px] text-finery-purple-400 placeholder:text-finery-disabledText focus:border-finery-purple-400 focus:outline-none focus:ring-2 focus:ring-finery-purple-400/20";

const noAutofill = {
  autoComplete: "new-password",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  name: "no-autofill",
  "data-1p-ignore": "true",
  "data-lpignore": "true",
  "data-form-type": "other",
  enterKeyHint: "next" as const,
} as const;

export default function AddressDetailsScreen() {
  const navigate = useNavigate();
  const pendingDraft = useOrderStore((s) => s.pendingAddressDraft);
  const setPendingAddressDraft = useOrderStore(
    (s) => s.setPendingAddressDraft,
  );
  const addAddress = useOrderStore((s) => s.addAddress);
  const updateAddress = useOrderStore((s) => s.updateAddress);
  const selectAddress = useOrderStore((s) => s.selectAddress);

  useEffect(() => {
    if (!pendingDraft) {
      navigate("/address/map", { replace: true });
      return;
    }
    if (!pendingDraft.type) {
      navigate("/address/type", { replace: true });
    }
  }, [pendingDraft, navigate]);

  const initialType = pendingDraft?.type ?? "apartment";
  const [type, setType] = useState<AddressType>(initialType);

  const [placeName, setPlaceName] = useState(() => {
    const f = pendingDraft?.fields;
    if (!f) return "";
    if ("building" in f) return f.building;
    if ("community" in f) return f.community;
    if ("hotelName" in f) return f.hotelName;
    return "";
  });

  const [unitNumber, setUnitNumber] = useState(() => {
    const f = pendingDraft?.fields;
    if (!f) return "";
    if ("aptNumber" in f) return f.aptNumber;
    if ("officeNumber" in f) return f.officeNumber;
    if ("villaNumber" in f) return f.villaNumber;
    if ("roomNumber" in f) return f.roomNumber;
    return "";
  });

  const [villaStreet, setVillaStreet] = useState(
    (pendingDraft?.fields as VillaFields | undefined)?.street ?? "",
  );
  const [hotelGuest, setHotelGuest] = useState(
    (pendingDraft?.fields as HotelFields | undefined)?.guestName ?? "",
  );

  const [notes, setNotes] = useState(
    (pendingDraft?.fields as { notes?: string } | undefined)?.notes ?? "",
  );

  const isEditMode = pendingDraft?.id !== undefined;

  const onSwitchType = (newType: AddressType) => {
    if (newType === type) return;
    haptics.light();
    setType(newType);
  };

  const canContinue = useMemo(() => {
    const hasPlace = placeName.trim().length > 0;
    const hasUnit = unitNumber.trim().length > 0;
    switch (type) {
      case "apartment":
      case "office":
        return hasPlace && hasUnit;
      case "villa":
        return hasPlace && villaStreet.trim().length > 0 && hasUnit;
      case "hotel":
        return hasPlace && hasUnit && hotelGuest.trim().length > 0;
    }
  }, [type, placeName, unitNumber, villaStreet, hotelGuest]);

  if (!pendingDraft || !pendingDraft.type) return null;

  const onBack = () => {
    haptics.light();
    navigate("/address/type");
  };

  const onContinue = () => {
    if (!canContinue) return;
    haptics.medium();

    const trimmedNotes = notes.trim();
    const baseShared = {
      lat: pendingDraft.lat,
      lng: pendingDraft.lng,
      formattedAddress: pendingDraft.formattedAddress,
    };
    const id = pendingDraft.id ?? `addr_${Date.now()}`;

    let address: Address;
    const trimmedPlace = placeName.trim();
    const trimmedUnit = unitNumber.trim();
    switch (type) {
      case "apartment":
        address = {
          id,
          type: "apartment",
          ...baseShared,
          fields: {
            building: trimmedPlace,
            aptNumber: trimmedUnit,
            ...(trimmedNotes ? { notes: trimmedNotes } : {}),
          },
        };
        break;
      case "office":
        address = {
          id,
          type: "office",
          ...baseShared,
          fields: {
            building: trimmedPlace,
            officeNumber: trimmedUnit,
            ...(trimmedNotes ? { notes: trimmedNotes } : {}),
          },
        };
        break;
      case "villa":
        address = {
          id,
          type: "villa",
          ...baseShared,
          fields: {
            community: trimmedPlace,
            street: villaStreet.trim(),
            villaNumber: trimmedUnit,
            ...(trimmedNotes ? { notes: trimmedNotes } : {}),
          },
        };
        break;
      case "hotel":
        address = {
          id,
          type: "hotel",
          ...baseShared,
          fields: {
            hotelName: trimmedPlace,
            roomNumber: trimmedUnit,
            guestName: hotelGuest.trim(),
            ...(trimmedNotes ? { notes: trimmedNotes } : {}),
          },
        };
        break;
    }

    if (isEditMode) {
      updateAddress(address);
      selectAddress(address.id);
    } else {
      addAddress(address);
    }
    setPendingAddressDraft(null);
    navigate("/");
  };

  const titleVerb = isEditMode ? "Edit" : "Add";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-finery-beige-100">
      <div className="flex-1 overflow-y-auto px-6 pt-[max(env(safe-area-inset-top),1.5rem)] pb-4">
        <div className="mb-6 flex flex-col gap-[14px]">
          <h1 className="font-display text-[18px] font-bold leading-[21px] tracking-[0.4px] text-finery-purple-400">
            {titleVerb} {TYPE_TITLE[type]}
          </h1>

          <div className="flex gap-[5px]">
            {TYPES.map((t) => (
              <AddressTypeTile
                key={t}
                type={t}
                selected={type === t}
                onSelect={() => onSwitchType(t)}
                variant="chip"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {type === "apartment" ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  {...noAutofill}
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Building name"
                  className={`${inputClass} flex-[217]`}
                />
                <input
                  type="text"
                  {...noAutofill}
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  placeholder="Apt #"
                  className={`${inputClass} flex-[102]`}
                  enterKeyHint="done"
                />
              </div>
              <NotesField notes={notes} setNotes={setNotes} />
            </div>
          ) : null}

          {type === "office" ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  {...noAutofill}
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Building name"
                  className={`${inputClass} flex-[217]`}
                />
                <input
                  type="text"
                  {...noAutofill}
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  placeholder="Office #"
                  className={`${inputClass} flex-[102]`}
                  enterKeyHint="done"
                />
              </div>
              <NotesField notes={notes} setNotes={setNotes} />
            </div>
          ) : null}

          {type === "villa" ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                {...noAutofill}
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Community / Area"
                className={inputClass}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  {...noAutofill}
                  value={villaStreet}
                  onChange={(e) => setVillaStreet(e.target.value)}
                  placeholder="Street"
                  className={`${inputClass} flex-[217]`}
                />
                <input
                  type="text"
                  {...noAutofill}
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  placeholder="Villa #"
                  className={`${inputClass} flex-[102]`}
                  enterKeyHint="done"
                />
              </div>
              <NotesField notes={notes} setNotes={setNotes} />
            </div>
          ) : null}

          {type === "hotel" ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  {...noAutofill}
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Hotel Name"
                  className={`${inputClass} flex-[217]`}
                />
                <input
                  type="text"
                  {...noAutofill}
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  placeholder="Room #"
                  className={`${inputClass} flex-[102]`}
                />
              </div>
              <input
                type="text"
                {...noAutofill}
                value={hotelGuest}
                onChange={(e) => setHotelGuest(e.target.value)}
                placeholder="Guest full name (for reception)"
                className={inputClass}
                enterKeyHint="done"
              />
              <NotesField notes={notes} setNotes={setNotes} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-finery-beige-200 px-6 pt-3 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
        <FineryButton variant="tiny" onClick={onBack} aria-label="Back" />
        <div className="flex-1">
          <FineryButton
            onClick={onContinue}
            disabled={!canContinue}
            className="w-full"
          >
            Continue
          </FineryButton>
        </div>
      </div>
    </div>
  );
}

interface NotesFieldProps {
  notes: string;
  setNotes: (s: string) => void;
}

function NotesField({ notes, setNotes }: NotesFieldProps) {
  return (
    <input
      type="text"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Notes (optional)"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="sentences"
      spellCheck
      className="h-[46px] w-full rounded-[6px] border border-[#E8E1D6] bg-white px-4 font-sans text-[14px] font-light leading-[20px] tracking-[0.1px] text-finery-purple-400 placeholder:text-finery-disabledText focus:border-finery-purple-400 focus:outline-none focus:ring-2 focus:ring-finery-purple-400/20"
    />
  );
}