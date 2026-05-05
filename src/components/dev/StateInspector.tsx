import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useOrderStore, type FlowType } from "@/stores/orderStore";
import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";

const FLOW_TYPE_OPTIONS: Array<{
  value: FlowType;
  label: string;
  description: string;
}> = [
  {
    value: "nu",
    label: "New User",
    description:
      "First-time orderer. No saved address by default — starts at S1 empty state.",
  },
  {
    value: "eu",
    label: "Existing User",
    description:
      "Returning customer. Always has a saved address — starts at S1.b pre-filled state.",
  },
];

function StateInspectorInner() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const store = useOrderStore();
  const flowType = store.flowType;
  const hasSavedAddress = store.addresses.length > 0;

  const [pendingReset, setPendingReset] = useState(false);

  const onPickFlow = (next: FlowType) => {
    store.setFlowType(next);
  };

  const onToggleSavedAddress = () => {
    store.devSetHasSavedAddress(!hasSavedAddress);
  };

  const onConfirm = () => {
    haptics.medium();
    if (pendingReset) {
      store.reset();
      setPendingReset(false);
    }
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="press-effect fixed bottom-4 right-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-finery-purple-400 text-finery-beige-100 shadow-lg"
        aria-label="Open State Inspector"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-[340px] flex-col gap-0 p-0">
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="space-y-1 border-b px-4 py-4">
              <h2 className="font-display text-lg font-bold text-finery-purple-400">
                State Inspector
              </h2>
              <p className="text-xs text-muted-foreground">
                Stage settings, then tap Confirm to apply and navigate.
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                Current path: {location.pathname}
              </p>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto scroll-momentum px-4 py-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-finery-purple-400">
                  Flow Type
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Switches the customer journey variant.
                </p>
                <div className="space-y-2">
                  {FLOW_TYPE_OPTIONS.map((opt) => {
                    const selected = flowType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onPickFlow(opt.value)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left transition-colors",
                          selected
                            ? "border-finery-purple-400 bg-finery-purple-100"
                            : "border-border bg-background hover:border-finery-purple-400/40",
                        )}
                      >
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-finery-purple-400">
                          {selected ? (
                            <span className="h-2 w-2 rounded-full bg-finery-purple-400" />
                          ) : null}
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-foreground">
                            {opt.label}
                          </span>
                          <span className="text-[11px] leading-snug text-muted-foreground">
                            {opt.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-finery-purple-400">
                  Saved Address
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Simulate whether the user has a saved address.
                </p>
                <button
                  type="button"
                  onClick={onToggleSavedAddress}
                  className={cn(
                    "press-effect flex h-[36px] w-full items-center justify-between rounded-md border bg-background px-3 text-sm font-medium transition-colors",
                    hasSavedAddress
                      ? "border-finery-purple-400 text-foreground"
                      : "border-border text-foreground hover:border-finery-purple-400/40",
                  )}
                >
                  <span>{hasSavedAddress ? "Has saved address" : "No saved address"}</span>
                  <span className={cn(
                    "h-3 w-3 rounded-full",
                    hasSavedAddress ? "bg-finery-teal-400" : "bg-finery-disabledBg",
                  )} />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-finery-purple-400">
                  Reset Flow
                </p>
                <p className="text-[11px] text-muted-foreground">
                  When checked, tapping Confirm clears notes, pickup slot, payment, and promocode.
                </p>
                <button
                  type="button"
                  onClick={() => setPendingReset((v) => !v)}
                  className={cn(
                    "press-effect flex h-[36px] w-full items-center justify-between rounded-md border bg-background px-3 text-sm font-medium transition-colors",
                    pendingReset
                      ? "border-finery-purple-400 text-foreground"
                      : "border-border text-foreground hover:border-finery-purple-400/40",
                  )}
                  aria-pressed={pendingReset}
                >
                  <span>{pendingReset ? "Reset on Confirm" : "Don't reset"}</span>
                  <span className={cn(
                    "h-3 w-3 rounded-full",
                    pendingReset ? "bg-finery-teal-400" : "bg-finery-disabledBg",
                  )} />
                </button>
              </div>
            </div>

            <div className="border-t px-4 py-3">
              <button
                type="button"
                onClick={onConfirm}
                className="press-effect flex h-[42px] w-full items-center justify-center rounded-[8px] bg-finery-purple-400 font-display text-[14px] text-finery-beige-100"
              >
                Confirm
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function StateInspector() {
  if (import.meta.env.MODE === "production") return null;
  return <StateInspectorInner />;
}

export default StateInspector;