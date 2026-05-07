import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState, type Key } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FineryFooter } from "@/components/finery/FineryFooter";
import { FineryPageTitle } from "@/components/finery/FineryPageTitle";
import { FineryStepper } from "@/components/finery/FineryStepper";

/**
 * OrderShell — persistent chrome for the Finery order flow.
 *
 * Mirrors laundry's OrderShell pattern:
 *   - Header with title + step indicator stays mounted across navigations
 *   - Title text crossfades when it changes
 *   - Step indicator uses CSS scaleX animation when steps fill
 *   - Footer (back + CTA + optional insurance band) stays mounted; CTA crossfades
 *   - Only the body remounts on route change
 *
 * Pages declare their chrome via useOrderChrome({ title, step, totalSteps, onBack, cta, insuranceCopy }).
 *
 * Body has no horizontal padding — each page adds its own px-6 where
 * needed. This lets Finery's full-bleed S1 rows escape page padding
 * without negative margins.
 */

export interface OrderChrome {
  title: ReactNode;
  step?: 1 | 2 | 3;
  totalSteps?: number;
  onBack?: () => void;
  cta?: ReactNode;
  /** Optional content rendered above the back+cta row in the footer. */
  footerAboveSlot?: ReactNode;
  /** Stable key used to crossfade the CTA between screens. Defaults to pathname. */
  ctaKey?: string;
  /** Right-side slot in the header title row (e.g. price chip). Empty by default for Finery. */
  supportSlot?: ReactNode;
  /** Insurance strip copy. Pass null to hide. */
  insuranceCopy?: ReactNode | null;
}

interface ChromeContextValue {
  chrome: OrderChrome | null;
  setChrome: (next: OrderChrome | null) => void;
}

const ChromeContext = createContext<ChromeContextValue | null>(null);

/** Returns true when rendered inside <OrderShell />. */
export function useIsInsideOrderShell(): boolean {
  return useContext(ChromeContext) != null;
}

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

  const title = chrome?.title ?? null;
  const step = chrome?.step;
  const totalSteps = chrome?.totalSteps ?? 3;
  const showProgress = typeof step === "number";
  const ctaKey = chrome?.ctaKey ?? location.pathname;

  return (
    <ChromeContext.Provider value={value}>
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-finery-beige-200">

        {/* Persistent header */}
        <header className="shrink-0">
          <div className="px-6 pt-[max(env(safe-area-inset-top),24px)] pb-3">
            <div className="flex items-center justify-between">
              <div key={location.pathname} className="animate-page-in">
                <FineryPageTitle>{title}</FineryPageTitle>
              </div>
              {chrome?.supportSlot ? <div>{chrome.supportSlot}</div> : null}
            </div>

            {showProgress && (
              <FineryStepper step={step!} totalSteps={totalSteps} className="mt-3" />
            )}
          </div>
        </header>

        {/* Body — remounts on route change, scrolls independently */}
        <main key={location.pathname} className="animate-page-in flex-1 overflow-y-auto overscroll-contain pt-3">
          <Outlet />
        </main>

        {/* Persistent footer */}
        {chrome?.cta && (
          <FineryFooter
            onBack={chrome.onBack}
            cta={
              <div key={ctaKey} className="animate-page-in">
                {chrome.cta}
              </div>
            }
            aboveSlot={chrome.footerAboveSlot}
            insuranceCopy={chrome.insuranceCopy}
          />
        )}
      </div>
    </ChromeContext.Provider>
  );
}