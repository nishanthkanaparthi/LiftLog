type WeightTrackingCardProps = {
  currentWeight?: string;
  setCurrentWeight?: (value: string) => void;
  savedCurrentWeight: number;
  savedWeightGoal: number;
  onUpdateWeight?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  isModal?: boolean;
  isOpen?: boolean;
};

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function formatValue(value: number) {
  const rounded = round1(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function formatWeightDisplay(value: number) {
  if (value <= 0) {
    return "—";
  }
  return `${formatValue(value)} lbs`;
}

export default function WeightTrackingCard({
  currentWeight = "",
  setCurrentWeight,
  savedCurrentWeight,
  savedWeightGoal,
  onUpdateWeight,
  onOpen,
  onClose,
  isModal = false,
  isOpen = false,
}: WeightTrackingCardProps) {
  if (!isModal) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <div className="p-6 md:p-7">
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Weight Tracking
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Update your latest weigh-in without keeping the full form on the page.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-zinc-500">Current</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatWeightDisplay(savedCurrentWeight)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-zinc-500">Goal</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatWeightDisplay(savedWeightGoal)}
              </p>
            </div>
          </div>

          <button
            onClick={onOpen}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Update Current Weight
          </button>
        </div>
      </section>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111113] shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl font-semibold text-white">Update Weight</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Log your current weight and keep your dashboard up to date.
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-zinc-500">Saved Current</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatWeightDisplay(savedCurrentWeight)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-zinc-500">Goal Weight</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatWeightDisplay(savedWeightGoal)}
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Current Weight (lbs)
            </label>
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight?.(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-white/20"
              placeholder="156"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08]"
          >
            Cancel
          </button>

          <button
            onClick={onUpdateWeight}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Save Weight
          </button>
        </div>
      </div>
    </div>
  );
}