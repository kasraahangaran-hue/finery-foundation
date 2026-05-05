import { useState } from "react";
import { MessageCircle, DollarSign, MapPin, Clock, Truck } from "lucide-react";
import { FineryButton } from "@/components/finery/FineryButton";
import { FineryHeader } from "@/components/finery/FineryHeader";
import { FineryFooter } from "@/components/finery/FineryFooter";
import { FineryStepper } from "@/components/finery/FineryStepper";
import { FineryWidgetRow } from "@/components/finery/FineryWidgetRow";
import { CallbackCheckboxRow } from "@/components/finery/CallbackCheckboxRow";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="font-display text-[18px] font-bold text-finery-purple-400">
      {title}
    </h2>
    <div className="space-y-2">{children}</div>
  </section>
);

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-sans text-[11px] text-finery-textSecondary">{children}</p>
);

export default function DevAtoms() {
  const [stepperStep, setStepperStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="flex min-h-screen flex-col bg-finery-beige-200">
      <FineryHeader
        title="Dev Atoms"
        onBack={() => console.log("[DevAtoms] back tapped")}
        trailingSlot1={<MessageCircle className="h-5 w-5" />}
        trailingSlot2={<DollarSign className="h-5 w-5" />}
      />

      <main className="flex-1 overflow-y-auto scroll-momentum space-y-8 px-6 py-6">
        <Section title="FineryStepper">
          <SubLabel>Tap to cycle through steps 1 → 2 → 3.</SubLabel>
          <button
            type="button"
            onClick={() => setStepperStep((s) => (s === 3 ? 1 : ((s + 1) as 1 | 2 | 3)))}
            className="press-effect w-full rounded-[var(--radius)] bg-finery-beige-100 p-4"
          >
            <FineryStepper step={stepperStep} />
            <p className="mt-2 text-center font-sans text-[12px] text-finery-textSecondary">
              Step {stepperStep} of 3
            </p>
          </button>
        </Section>

        <Section title="FineryButton — primary">
          <FineryButton>Place Order</FineryButton>
          <SubLabel>Disabled state:</SubLabel>
          <FineryButton disabled>Place Order</FineryButton>
        </Section>

        <Section title="FineryButton — outline">
          <FineryButton variant="outline">Add Address</FineryButton>
          <SubLabel>Disabled state:</SubLabel>
          <FineryButton variant="outline" disabled>Add Address</FineryButton>
        </Section>

        <Section title="FineryButton — tiny">
          <div className="flex items-center gap-2">
            <FineryButton variant="tiny" />
            <FineryButton>Place Order</FineryButton>
          </div>
          <SubLabel>Pairs with primary CTA in the sticky footer of S8.</SubLabel>
        </Section>

        <Section title="FineryWidgetRow — active">
          <FineryWidgetRow
            variant="active"
            icon={<MapPin className="h-5 w-5" />}
            title="Add Address"
            onClick={() => console.log("[DevAtoms] active row tapped")}
          />
          <FineryWidgetRow
            variant="active"
            icon={<Clock className="h-5 w-5" />}
            title="Schedule Collection"
            subtitle="Mon, 12 May • 9:00–11:00"
            onClick={() => console.log("[DevAtoms] active row w/subtitle tapped")}
          />
        </Section>

        <Section title="FineryWidgetRow — locked">
          <FineryWidgetRow
            variant="locked"
            icon={<Clock className="h-5 w-5" />}
            title="Schedule Collection"
          />
          <FineryWidgetRow
            variant="locked"
            icon={<Truck className="h-5 w-5" />}
            title="View Delivery Times"
            subtitle="Add address first"
          />
        </Section>

        <Section title="FineryWidgetRow — summary">
          <FineryWidgetRow
            variant="summary"
            icon={<MapPin className="h-5 w-5" />}
            title="Apt 3, The Address Tower"
            subtitle="Downtown Dubai"
          />
          <FineryWidgetRow
            variant="summary"
            icon={<Clock className="h-5 w-5" />}
            title="Pick up in person"
            subtitle="Mon, 12 May • 9:00–11:00"
          />
        </Section>

        <Section title="CallbackCheckboxRow">
          <CallbackCheckboxRow />
          <SubLabel>Pre-checked, disabled. Read-only commitment row.</SubLabel>
        </Section>

        <div className="h-32" />
      </main>

      <FineryFooter insuranceNote="All items are insured up to AED 5,000 per order." animate>
        <FineryButton variant="tiny" />
        <FineryButton>Place Order</FineryButton>
      </FineryFooter>
    </div>
  );
}