export default function DashboardHeader({
  savedCalories,
  savedCalorieGoal,
  savedProtein,
  savedProteinGoal,
  savedCurrentWeight,
  savedWeightGoal,
}: {
  savedCalories: number;
  savedCalorieGoal: number;
  savedProtein: number;
  savedProteinGoal: number;
  savedCurrentWeight: number;
  savedWeightGoal: number;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.22em] text-zinc-500">LiftLog</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Track your nutrition, daily progress, and body weight in one clean place.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="grid grid-cols-2 gap-3 md:flex">
          <div className="min-w-[110px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs text-zinc-500">Calories</p>
            <p className="text-lg font-semibold">{savedCalories}</p>
            <p className="mt-1 text-xs text-zinc-500">of {savedCalorieGoal}</p>
          </div>
          <div className="min-w-[110px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs text-zinc-500">Protein</p>
            <p className="text-lg font-semibold">{savedProtein}g</p>
            <p className="mt-1 text-xs text-zinc-500">of {savedProteinGoal}g</p>
          </div>
          <div className="min-w-[110px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs text-zinc-500">Weight</p>
            <p className="text-lg font-semibold">{savedCurrentWeight} lbs</p>
            <p className="mt-1 text-xs text-zinc-500">goal {savedWeightGoal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}