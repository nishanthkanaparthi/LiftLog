export default function SecondaryButton({
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
        className={`rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-3 font-medium text-white transition hover:scale-[1.01] hover:bg-white/[0.06] active:scale-[0.98] ${className}`}
      >
        {children}
      </button>
    );
  }