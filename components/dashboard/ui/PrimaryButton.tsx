export default function PrimaryButton({
    children,
    onClick,
    className = "",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
  }) {
    return (
      <button
        onClick={onClick}
        className={`rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-[1.01] hover:opacity-90 active:scale-[0.98] ${className}`}
      >
        {children}
      </button>
    );
  }