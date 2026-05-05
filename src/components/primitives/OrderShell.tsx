import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FineryHeader } from "@/components/finery/FineryHeader";
import { FineryFooter } from "@/components/finery/FineryFooter";
import { FineryStepper } from "@/components/finery/FineryStepper";

export interface OrderChrome {
  title: string;
  step?: 1 | 2 | 3;
  onBack?: () => void;
  cta?: ReactNode;
  footerAboveSlot?: ReactNode;
  trailingSlot1?: ReactNode;
  trailingSlot2?: ReactNode;
  ctaKey?: string;
}

interface ChromeContextValue {
  chrome: OrderChrome | null;
  setChrome: (next: OrderChrome | null) => void;
}

const ChromeContext = createContext<ChromeContextValue | null>(null);

export function useOrderChrome(config: OrderChrome) {
  const ctx = useContext(ChromeContext);
  if (!ctx) {
    throw new Error("useOrderChrome must be used inside <OrderShell />");
  }
  const { setChrome } = ctx;
  useEffect(() => {
    setChrome(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
}

export function OrderShell() {
  const [chrome, setChromeState] = useState<OrderChrome | null>(null);
  const setChrome = useCallback((next: OrderChrome | null) => {
    setChromeState((prev) => (prev === next ? prev : next));
  }, []);
  const value = useMemo(() => ({ chrome, setChrome }), [chrome, setChrome]);
  const location = useLocation();

  const title = chrome?.title ?? "";
  const step = chrome?.step;
  const showProgress = typeof step === "number";
  const ctaKey = chrome?.ctaKey ?? location.pathname;

  return (
    <ChromeContext.Provider value={value}>
      <div className="flex min-h-[100dvh] flex-col bg-finery-beige-200">
        <FineryHeader
          title={title}
          onBack={chrome?.onBack}
          trailingSlot1={chrome?.trailingSlot1}
          trailingSlot2={chrome?.trailingSlot2}
        />

        {showProgress && (
          <div className="px-6 pb-2">
            <FineryStepper step={step} />
          </div>
        )}

        <div key={location.pathname} className="animate-page-in flex-1 px-6 pb-4 pt-3">
          <Outlet />
        </div>

        {chrome?.cta && (
          <FineryFooter insuranceNote={chrome.footerAboveSlot}>
            <div key={ctaKey} className="w-full animate-page-in">
              {chrome.cta}
            </div>
          </FineryFooter>
        )}
      </div>
    </ChromeContext.Provider>
  );
}