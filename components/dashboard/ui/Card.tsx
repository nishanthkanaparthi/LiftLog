export default function Card({
    title,
    subtitle,
    children,
    className = "",
  }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <section
        className={`rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:bg-white/[0.055] ${className}`}
      >
        <div className="p-6 md:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
          </div>
          {children}
        </div>
      </section>
    );
  }