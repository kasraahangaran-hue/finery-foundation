import { useState } from 'react';
import { useOrderStore } from '@/stores/orderStore';

const DevPanel = () => {
  const [open, setOpen] = useState(false);
  const state = useOrderStore();

  if (!import.meta.env.DEV) return null;

  const { setFlowType, setAddressId, setPickupSlot, setNotes, setPaymentMethodId, setPromocode, reset, ...data } = state;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-[320px]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="ml-auto block rounded-full bg-finery-purple-400/80 px-3 py-1 text-xs text-white font-medium backdrop-blur"
      >
        {open ? 'Close' : 'Dev'}
      </button>
      {open && (
        <pre className="mt-2 max-h-[50vh] overflow-auto rounded-lg bg-black/80 p-3 text-[11px] leading-relaxed text-green-300 backdrop-blur scroll-momentum">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DevPanel;