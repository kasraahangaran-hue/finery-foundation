import { useOrderChrome } from "@/components/primitives/OrderShell";

interface Props {
  name: string;
}

const PlaceholderPage = ({ name }: Props) => {
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
};

export default PlaceholderPage;