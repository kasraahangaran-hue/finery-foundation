 import { BottomSheetShell } from "@/components/primitives/BottomSheetShell";
 import { FineryRadio } from "@/components/finery/FineryRadio";
 import { RawSvg } from "@/components/finery/RawSvg";
 import { useOrderStore, type PaymentState } from "@/stores/orderStore";
 import applePayUrl from "@/assets/icons/finery/apple-pay.svg?raw";
 import creditCardUrl from "@/assets/icons/finery/credit-card.svg?raw";

 const STUB_LAST4 = "4242";

 interface PaymentMethodSheetProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
 }

 export function PaymentMethodSheet({ open, onOpenChange }: PaymentMethodSheetProps) {
   const payment = useOrderStore((s) => s.payment);
   const setPayment = useOrderStore((s) => s.setPayment);

   const currentMethod = payment?.method ?? "apple_pay";

   const select = (next: PaymentState) => {
     setPayment(next);
     setTimeout(() => onOpenChange(false), 80);
   };

   return (
     <BottomSheetShell
       open={open}
       onOpenChange={onOpenChange}
       title="Payment Method"
       footer="none"
     >
       <div className="flex flex-col">
         <button
           type="button"
           onClick={() => select({ method: "apple_pay" })}
           className="press-effect flex w-full items-center justify-between gap-3"
         >
           <div className="flex items-center gap-3">
             <RawSvg svg={applePayUrl} className="h-5 w-5" />
             <span className="font-display text-[14px] font-bold text-finery-purple-400">
               Apple Pay
             </span>
           </div>
           <FineryRadio
             label=""
             selected={currentMethod === "apple_pay"}
             onSelect={() => select({ method: "apple_pay" })}
             className="pointer-events-none w-auto"
           />
         </button>
         <button
           type="button"
           onClick={() => select({ method: "credit_card", last4: STUB_LAST4 })}
           className="press-effect flex w-full items-center justify-between gap-3"
         >
           <div className="flex items-center gap-3">
             <RawSvg svg={creditCardUrl} className="h-5 w-5" />
             <span className="font-display text-[14px] font-bold text-finery-purple-400">
               Credit Card •••• {STUB_LAST4}
             </span>
           </div>
           <FineryRadio
             label=""
             selected={currentMethod === "credit_card"}
             onSelect={() => select({ method: "credit_card", last4: STUB_LAST4 })}
             className="pointer-events-none w-auto"
           />
         </button>
       </div>
     </BottomSheetShell>
   );
 }