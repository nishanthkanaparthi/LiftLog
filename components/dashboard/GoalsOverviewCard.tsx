type GoalsOverviewCardProps = {
  savedCalorieGoal: number;
  savedProteinGoal: number;
  savedCarbGoal: number;
  savedFatGoal: number;
  savedWeightGoal: number;
};

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function formatMacro(value: number) {
  const rounded = round1(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export default function GoalsOverviewCard({
  savedCalorieGoal,
  savedProteinGoal,
  savedCarbGoal,
  savedFatGoal,
  savedWeightGoal,
}: GoalsOverviewCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="p-6 md:p-7">
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Goals Overview
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Your saved daily targets and weight goal.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Calories</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatMacro(savedCalorieGoal)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Protein</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatMacro(savedProteinGoal)}g
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Carbs</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatMacro(savedCarbGoal)}g
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Fats</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatMacro(savedFatGoal)}g
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 col-span-2">
            <p className="text-xs text-zinc-500">Goal Weight</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatMacro(savedWeightGoal)} lbs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}