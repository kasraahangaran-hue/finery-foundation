import { create } from 'zustand';

interface Note {
  id: string;
  photoUrl: string | null;
  text: string;
}

interface PickupSlot {
  date: string;
  window: string;
}

interface OrderState {
  flowType: 'nu' | 'eu';
  addressId: string | null;
  pickupSlot: PickupSlot | null;
  notes: Note[];
  paymentMethodId: string | null;
  promocode: string | null;
  setFlowType: (t: 'nu' | 'eu') => void;
  setAddressId: (id: string | null) => void;
  setPickupSlot: (slot: PickupSlot | null) => void;
  setNotes: (notes: Note[]) => void;
  setPaymentMethodId: (id: string | null) => void;
  setPromocode: (code: string | null) => void;
  reset: () => void;
}

const initialState = {
  flowType: 'nu' as const,
  addressId: null,
  pickupSlot: null,
  notes: [],
  paymentMethodId: null,
  promocode: null,
};

export const useOrderStore = create<OrderState>((set) => ({
  ...initialState,
  setFlowType: (flowType) => set({ flowType }),
  setAddressId: (addressId) => set({ addressId }),
  setPickupSlot: (pickupSlot) => set({ pickupSlot }),
  setNotes: (notes) => set({ notes }),
  setPaymentMethodId: (paymentMethodId) => set({ paymentMethodId }),
  setPromocode: (promocode) => set({ promocode }),
  reset: () => set(initialState),
}));