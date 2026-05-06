import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FineryFooter } from "@/components/finery/FineryFooter";
import { FineryPageTitle } from "@/components/finery/FineryPageTitle";
import { cn } from "@/lib/utils";

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
  title: string;
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

  const title = chrome?.title ?? "";
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
              <div key={title} className="animate-page-in">
                <FineryPageTitle>{title}</FineryPageTitle>
              </div>
              {chrome?.supportSlot ? <div>{chrome.supportSlot}</div> : null}
            </div>

            {showProgress && (
              <div
                className="mt-3 flex w-full gap-1"
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-label={`Step ${step} of ${totalSteps}`}
              >
                {Array.from({ length: totalSteps }).map((_, i) => {
                  const idx = i + 1;
                  const filled = idx <= step!;
                  return (
                    <div key={i} className="h-[2px] flex-1 rounded-full bg-finery-disabledBg">
                      <div
                        className={cn(
                          "h-full rounded-full bg-finery-purple-400 transition-transform duration-500 origin-left",
                        )}
                        style={{ transform: filled ? "scaleX(1)" : "scaleX(0)" }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </header>

        {/* Body — remounts on route change, scrolls independently */}
        <main key={location.pathname} className="animate-page-in flex-1 overflow-y-auto overscroll-contain">
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