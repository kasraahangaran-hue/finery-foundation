import { useContext } from "react";
import { useOrderChrome } from "@/components/primitives/OrderShell";

interface Props {
  name: string;
}

const PlaceholderPage = ({ name }: Props) => {
  return <PlaceholderInner name={name} />;
};

export default PlaceholderPage;

/** Inner component — conditionally registers chrome if inside OrderShell */
function PlaceholderInner({ name }: Props) {
  // Try to register chrome; if outside OrderShell, render standalone
  try {
    useOrderChrome({
      title: `TODO ${name}`,
      step: name === "Instructions" ? 2 : name === "LastStep" ? 3 : undefined,
      totalSteps: 3,
    });
  } catch {
    // Not inside OrderShell — render standalone
    return (
      <div className="min-h-screen flex items-center justify-center bg-finery-beige-200 px-safe">
        <p className="font-display text-xl text-finery-purple-400">TODO {name}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <p className="font-display text-xl text-finery-purple-400">TODO {name}</p>
    </div>
  );
}