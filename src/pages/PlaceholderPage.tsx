interface Props {
  name: string;
}

const PlaceholderPage = ({ name }: Props) => (
  <div className="min-h-screen flex items-center justify-center bg-finery-beige-200 px-safe">
    <p className="font-display text-xl text-finery-purple-400">TODO {name}</p>
  </div>
);

export default PlaceholderPage;