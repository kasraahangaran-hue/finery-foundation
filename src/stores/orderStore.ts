import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FlowType = "nu" | "eu";

export type AddressType = "apartment" | "villa" | "hotel" | "office";

export type ValetPickupPreference =
  | "no_preference"
  | "ring_doorbell"
  | "knock_door"
  | "do_not_disturb_bags_outside"
  | "call_when_arrive";

export type ValetDeliveryPreference =
  | "no_preference"
  | "hang_door_handle"
  | "at_concierge"
  | "knock_door"
  | "call_when_arrive";

export interface ApartmentFields {
  building: string;
  aptNumber: string;
  notes?: string;
}

export interface VillaFields {
  community: string;
  street: string;
  villaNumber: string;
  notes?: string;
}

export interface HotelFields {
  hotelName: string;
  roomNumber: string;
  guestName: string;
  notes?: string;
}

export interface OfficeFields {
  building: string;
  officeNumber: string;
  notes?: string;
}

export type AddressFields =
  | { type: "apartment"; fields: ApartmentFields }
  | { type: "villa"; fields: VillaFields }
  | { type: "hotel"; fields: HotelFields }
  | { type: "office"; fields: OfficeFields };

export type Address = {
  id: string;
  lat: number;
  lng: number;
  formattedAddress: string;
} & AddressFields;

export interface PendingAddressDraft {
  id?: string;
  lat: number;
  lng: number;
  formattedAddress: string;
  type?: AddressType;
  fields?: ApartmentFields | VillaFields | HotelFields | OfficeFields;
}

export interface PickupSlot {
  date: string;
  window: string;
}

// Default placeholder slot — the earliest no-surcharge window for "now".
// Real slot computation (zone-aware, time-of-day-aware) comes in Block 3C.
export const DEFAULT_PICKUP_SLOT: PickupSlot = {
  date: "Today",
  window: "05:00 pm - 06:00 pm",
};

export interface Note {
  id: string;
  photoUrl: string | null;
  text: string;
}

export interface PaymentState {
  method: string;
  last4?: string;
}

export interface OrderState {
  flowType: FlowType;
  addresses: Address[];
  selectedAddressId: string | null;
  pendingAddressDraft: PendingAddressDraft | null;
  pickupSlot: PickupSlot | null;
  deliveryTimesAcknowledged: boolean;
  notes: Note[];
  payment: PaymentState | null;
  promocode: string | null;
  valetPickupPreference: ValetPickupPreference;
  valetDeliveryPreference: ValetDeliveryPreference;

  setFlowType: (t: FlowType) => void;
  addAddress: (a: Address) => void;
  updateAddress: (a: Address) => void;
  deleteAddress: (id: string) => void;
  selectAddress: (id: string | null) => void;
  devSetHasSavedAddress: (hasSaved: boolean) => void;
  setPendingAddressDraft: (d: PendingAddressDraft | null) => void;
  setPickupSlot: (s: PickupSlot | null) => void;
  setDeliveryTimesAcknowledged: (v: boolean) => void;
  setNotes: (notes: Note[]) => void;
  setPayment: (p: PaymentState | null) => void;
  setPromocode: (c: string | null) => void;
  setValetPreferences: (pickup: ValetPickupPreference, delivery: ValetDeliveryPreference) => void;
  reset: () => void;
}

const SEED_ADDRESS: Address = {
  id: "seed_addr_default",
  type: "office" as const,
  lat: 25.2105,
  lng: 55.2796,
  formattedAddress: "Al Ferdous 4, DIFC, Dubai",
  fields: {
    building: "Al Ferdous 4",
    officeNumber: "118",
  },
};

const initialState = {
  flowType: "nu" as FlowType,
  addresses: [SEED_ADDRESS],
  selectedAddressId: SEED_ADDRESS.id,
  pendingAddressDraft: null,
  pickupSlot: null,
  deliveryTimesAcknowledged: false,
  notes: [] as Note[],
  payment: null,
  promocode: null,
  valetPickupPreference: "no_preference" as ValetPickupPreference,
  valetDeliveryPreference: "no_preference" as ValetDeliveryPreference,
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      ...initialState,

      setFlowType: (flowType) => set({ flowType }),
      addAddress: (a) =>
        set((state) => ({
          addresses: [...state.addresses, a],
          selectedAddressId: a.id,
          pendingAddressDraft: null,
          // Auto-fill pickup with the default slot for any new address.
          pickupSlot: DEFAULT_PICKUP_SLOT,
        })),
      updateAddress: (a) =>
        set((state) => ({
          addresses: state.addresses.map((x) => (x.id === a.id ? a : x)),
          pendingAddressDraft: null,
        })),
      deleteAddress: (id) =>
        set((state) => {
          if (state.selectedAddressId === id) return state;
          return {
            addresses: state.addresses.filter((x) => x.id !== id),
          };
        }),
      selectAddress: (id) =>
        set(() => ({
          selectedAddressId: id,
          // Reset pickup to the default slot whenever the user changes address.
          pickupSlot: id != null ? DEFAULT_PICKUP_SLOT : null,
        })),
      devSetHasSavedAddress: (hasSaved) =>
        set(() =>
          hasSaved
            ? {
                addresses: [SEED_ADDRESS],
                selectedAddressId: SEED_ADDRESS.id,
                pickupSlot: DEFAULT_PICKUP_SLOT,
              }
            : {
                addresses: [],
                selectedAddressId: null,
                pickupSlot: null,
                deliveryTimesAcknowledged: false,
              },
        ),
      setPendingAddressDraft: (d) => set({ pendingAddressDraft: d }),
      setPickupSlot: (pickupSlot) => set({ pickupSlot }),
      setDeliveryTimesAcknowledged: (deliveryTimesAcknowledged) =>
        set({ deliveryTimesAcknowledged }),
      setNotes: (notes) => set({ notes }),
      setPayment: (payment) => set({ payment }),
      setPromocode: (promocode) => set({ promocode }),
      setValetPreferences: (pickup, delivery) =>
        set({ valetPickupPreference: pickup, valetDeliveryPreference: delivery }),

      reset: () =>
        set((state) => ({
          flowType: state.flowType,
          addresses: state.addresses,
          selectedAddressId: state.selectedAddressId,
          pendingAddressDraft: null,
          pickupSlot: null,
          deliveryTimesAcknowledged: false,
          notes: [],
          payment: null,
          promocode: null,
          valetPickupPreference: "no_preference",
          valetDeliveryPreference: "no_preference",
        })),
    }),
    {
      name: "finery.order.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        flowType: s.flowType,
        addresses: s.addresses,
        selectedAddressId: s.selectedAddressId,
        pickupSlot: s.pickupSlot,
        deliveryTimesAcknowledged: s.deliveryTimesAcknowledged,
        notes: s.notes,
        payment: s.payment,
        promocode: s.promocode,
        valetPickupPreference: s.valetPickupPreference,
        valetDeliveryPreference: s.valetDeliveryPreference,
      }),
    },
  ),
);