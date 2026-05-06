import { useOrderChrome, useIsInsideOrderShell } from "@/components/primitives/OrderShell";

interface Props {
  name: string;
}

const PlaceholderPage = ({ name }: Props) => {
  const insideShell = useIsInsideOrderShell();

  if (!insideShell) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-finery-beige-200 px-safe">
        <p className="font-display text-xl text-finery-purple-400">TODO {name}</p>
      </div>
    );
  }

  return <PlaceholderShellContent name={name} />;
};

export default PlaceholderPage;

function PlaceholderShellContent({ name }: Props) {
  useOrderChrome({
    title: `TODO ${name}`,
    step: name === "Instructions" ? 2 : name === "LastStep" ? 3 : undefined,
    totalSteps: 3,
  });

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <p className="font-display text-xl text-finery-purple-400">TODO {name}</p>
    </div>
  );
}