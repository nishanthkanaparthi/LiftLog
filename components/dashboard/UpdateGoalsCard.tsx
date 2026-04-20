type UpdateGoalsCardProps = {
  calorieGoal?: string;
  setCalorieGoal?: (value: string) => void;
  proteinGoal?: string;
  setProteinGoal?: (value: string) => void;
  carbGoal?: string;
  setCarbGoal?: (value: string) => void;
  fatGoal?: string;
  setFatGoal?: (value: string) => void;
  weightGoal?: string;
  setWeightGoal?: (value: string) => void;
  onSaveGoals?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  isModal?: boolean;
  isOpen?: boolean;
};

export default function UpdateGoalsCard({
  calorieGoal = "",
  setCalorieGoal,
  proteinGoal = "",
  setProteinGoal,
  carbGoal = "",
  setCarbGoal,
  fatGoal = "",
  setFatGoal,
  weightGoal = "",
  setWeightGoal,
  onSaveGoals,
  onOpen,
  onClose,
  isModal = false,
  isOpen = false,
}: UpdateGoalsCardProps) {
  if (!isModal) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <div className="p-6 md:p-7">
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Update Goals
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Adjust your calorie, macro, and target weight goals.
            </p>
          </div>

          <button
            onClick={onOpen}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Open Goal Settings
          </button>
        </div>
      </section>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111113] shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl font-semibold text-white">Update Goals</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Set your daily calorie and macro targets, plus your goal weight.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Calories
            </label>
            <input
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal?.(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-white/20"
              placeholder="3000"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Protein (g)
            </label>
            <input
              type="number"
              value={proteinGoal}
              onChange={(e) => setProteinGoal?.(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-white/20"
              placeholder="200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Carbs (g)
            </label>
            <input
              type="number"
              value={carbGoal}
              onChange={(e) => setCarbGoal?.(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-white/20"
              placeholder="250"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Fats (g)
            </label>
            <input
              type="number"
              value={fatGoal}
              onChange={(e) => setFatGoal?.(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-white/20"
              placeholder="100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Goal Weight (lbs)
            </label>
            <input
              type="number"
              value={weightGoal}
              onChange={(e) => setWeightGoal?.(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-white/20"
              placeholder="165"
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
            onClick={onSaveGoals}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Save Goals
          </button>
        </div>
      </div>
    </div>
  );
}