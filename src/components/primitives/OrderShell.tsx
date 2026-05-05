import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FineryFooter } from "@/components/finery/FineryFooter";

/**
 * OrderShell — page chrome for the Finery order flow.
 *
 * Finery has NO top app bar. Each page renders its own title inline as the
 * first content element. The shell only provides:
 *   - Status-bar safe area at top
 *   - Outlet for the current page
 *   - Optional sticky footer with insurance strip + CTA row
 */

export interface OrderChrome {
  footer?: ReactNode;
  footerKey?: string;
  insuranceCopy?: ReactNode | null;
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

  const footerKey = chrome?.footerKey ?? location.pathname;

  return (
    <ChromeContext.Provider value={value}>
      <div className="flex min-h-[100dvh] flex-col bg-finery-beige-200">
        <div className="pt-safe" />

        <div key={location.pathname} className="animate-page-in flex-1">
          <Outlet />
        </div>

        {chrome?.footer && (
          <FineryFooter insuranceCopy={chrome.insuranceCopy}>
            <div key={footerKey} className="w-full animate-page-in">
              {chrome.footer}
            </div>
          </FineryFooter>
        )}
      </div>
    </ChromeContext.Provider>
  );
}