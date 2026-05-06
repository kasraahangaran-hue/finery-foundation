import { useOrderStore } from "@/stores/orderStore";
import { BottomSheetShell } from "@/components/primitives/BottomSheetShell";
import { CallbackCheckboxRow } from "@/components/finery/CallbackCheckboxRow";

interface DeliveryTimesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TimingRow {
  category: string;
  duration: string;
}

const TIMING_ROWS: TimingRow[] = [
  { category: "Garments", duration: "3 days" },
  { category: "Bridal", duration: "8+ days" },
  { category: "Shoes & Bags", duration: "5-8 days" },
  { category: "Household", duration: "3 days" },
];

export function DeliveryTimesSheet({ open, onOpenChange }: DeliveryTimesSheetProps) {
  const setDeliveryTimesAcknowledged = useOrderStore((s) => s.setDeliveryTimesAcknowledged);

  const onDone = () => {
    setDeliveryTimesAcknowledged(true);
    onOpenChange(false);
  };

  return (
    <BottomSheetShell
      open={open}
      onOpenChange={onOpenChange}
      title=""
      hideHeader
      footer="apply-only"
      primaryLabel="Done"
      onPrimary={onDone}
    >
      <div className="flex flex-col gap-6">
        {/* Hero placeholder */}
        <div
          className="-mx-6 h-[150px]"
          style={{
            background:
              "linear-gradient(135deg, hsl(36 30% 88%) 0%, hsl(174 25% 75%) 100%)",
          }}
        />

        {/* Assessment Call section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h5 className="font-display text-[15px] font-bold leading-[20px] tracking-[0.4px] text-finery-purple-400">
              Assessment Call
            </h5>
            <div className="flex flex-col gap-3">
              <p className="font-sans text-[12px] font-light leading-[18px] tracking-[0.1px] text-finery-textSecondary">
                After receiving your items, The Finery® experts will need to assess the textiles &amp; material to determine the best treatment. This process is crucial to ensure the safety and quality of your items.
              </p>
              <p className="font-sans text-[12px] font-light leading-[18px] tracking-[0.1px] text-finery-textSecondary">
                The team will then call you to explain the process to be used to treat your items.
              </p>
            </div>
          </div>

          <CallbackCheckboxRow />
        </div>

        {/* Hairline divider */}
        <div className="h-px bg-finery-purple-400" style={{ height: "0.4px" }} />

        {/* Turnaround Time section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h5 className="font-display text-[15px] font-bold leading-[20px] tracking-[0.4px] text-finery-purple-400">
              Turnaround Time
            </h5>
            <p className="font-sans text-[12px] font-light leading-[18px] tracking-[0.1px] text-finery-textSecondary">
              Depending on your item material and cleaning process, below are the estimated turn around times. We will notify you during the assessment call.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {TIMING_ROWS.map((row) => (
              <div
                key={row.category}
                className="flex items-center justify-between bg-finery-beige-100 p-2"
              >
                <span className="font-sans text-[14px] font-medium leading-[20px] text-finery-purple-400">
                  {row.category}
                </span>
                <span className="font-display text-[16px] font-normal leading-[20px] tracking-[0.6px] text-finery-purple-400">
                  {row.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BottomSheetShell>
  );
}