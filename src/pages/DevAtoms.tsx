import { useState } from "react";
import { MessageCircle, DollarSign } from "lucide-react";
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

        <Section title="FineryWidgetRow — current">
          <FineryWidgetRow
            state="current"
            icon="address"
            title="Add Address"
            onPress={() => console.log("[DevAtoms] current address row tapped")}
          />
          <FineryWidgetRow
            state="current"
            icon="pickup"
            title="Schedule Collection"
            onPress={() => console.log("[DevAtoms] current pickup row tapped")}
          />
        </Section>

        <Section title="FineryWidgetRow — disabled">
          <FineryWidgetRow
            state="disabled"
            icon="pickup"
            title="Schedule Collection"
          />
          <FineryWidgetRow
            state="disabled"
            icon="delivery"
            title="View Delivery Times"
          />
        </Section>

        <Section title="FineryWidgetRow — populated">
          <FineryWidgetRow
            state="populated"
            icon="address"
            title="Address"
            subtitle="Al Ferdous 4, Office 118"
            onPress={() => console.log("[DevAtoms] populated address row tapped")}
          />
          <FineryWidgetRow
            state="populated"
            icon="pickup"
            title="Pickup in Person"
            subtitle="Today, 05:00 pm - 06:00 pm"
            onPress={() => console.log("[DevAtoms] populated pickup row tapped")}
          />
          <FineryWidgetRow
            state="populated"
            icon="delivery"
            title="Delivery"
            subtitle="After assessment, our team will call you"
            onPress={() => console.log("[DevAtoms] populated delivery row tapped")}
          />
        </Section>

        <Section title="CallbackCheckboxRow">
          <CallbackCheckboxRow />
          <SubLabel>Pre-checked, disabled. Read-only commitment row.</SubLabel>
        </Section>

        <div className="h-32" />
      </main>

      <FineryFooter animate>
        <FineryButton variant="tiny" />
        <FineryButton>Place Order</FineryButton>
      </FineryFooter>
    </div>
  );
}