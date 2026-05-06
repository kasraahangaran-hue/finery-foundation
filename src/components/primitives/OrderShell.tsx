import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FineryFooter } from "@/components/finery/FineryFooter";
import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";

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

export function useOrderChrome(config: OrderChrome) {
  const ctx = useContext(ChromeContext);
  if (!ctx) {
    throw new Error("useOrderChrome must be used inside <OrderShell />");
  }
  const { setChrome } = ctx;
  const { title, step, totalSteps, onBack, cta, ctaKey, supportSlot, insuranceCopy } = config;
  useEffect(() => {
    setChrome({ title, step, totalSteps, onBack, cta, ctaKey, supportSlot, insuranceCopy });
  }, [setChrome, title, step, totalSteps, onBack, cta, ctaKey, supportSlot, insuranceCopy]);
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
      <div className="flex min-h-[100dvh] flex-col bg-finery-beige-200">

        {/* Persistent header */}
        <div className="shrink-0">
          <div className="px-6 pt-[max(env(safe-area-inset-top),18px)]">
            <div className="flex items-center justify-between">
              <div key={title} className="animate-page-in">
                <h1 className="font-display text-[20px] font-bold leading-[28px] tracking-normal text-finery-purple-400">
                  {title}
                </h1>
              </div>
              {chrome?.supportSlot ? <div>{chrome.supportSlot}</div> : null}
            </div>

            {showProgress && (
              <div className="mt-[13px] flex w-full gap-[6px]">
                {Array.from({ length: totalSteps }).map((_, i) => {
                  const idx = i + 1;
                  const filled = idx <= step!;
                  return (
                    <div key={i} className="h-[2px] flex-1 bg-finery-disabledBg">
                      <div
                        className={cn(
                          "h-full bg-finery-purple-400 transition-transform duration-500 origin-left",
                          filled ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Body — remounts on route change */}
        <div key={location.pathname} className="animate-page-in flex-1">
          <Outlet />
        </div>

        {/* Persistent footer */}
        {chrome?.cta && (
          <FineryFooter insuranceCopy={chrome.insuranceCopy}>
            {chrome.onBack ? <BackButtonInline onBack={chrome.onBack} /> : null}
            <div key={ctaKey} className="animate-page-in flex-1">
              {chrome.cta}
            </div>
          </FineryFooter>
        )}
      </div>
    </ChromeContext.Provider>
  );
}

function BackButtonInline({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={() => {
        haptics.light();
        onBack();
      }}
      className="press-effect flex h-[42px] w-12 shrink-0 items-center justify-center border border-finery-purple-400 bg-finery-beige-100"
      aria-label="Back"
    >
      <ArrowLeft className="h-5 w-5 text-finery-purple-400" />
    </button>
  );
}