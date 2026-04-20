import Card from "./ui/Card";
import ProgressRow from "./ui/ProgressRow";

export default function DailyProgressCard({
  savedCalories,
  savedCalorieGoal,
  savedProtein,
  savedProteinGoal,
  savedCarbs,
  savedCarbGoal,
  savedFats,
  savedFatGoal,
  caloriesRemaining,
  proteinRemaining,
  carbsRemaining,
  fatsRemaining,
}: {
  savedCalories: number;
  savedCalorieGoal: number;
  savedProtein: number;
  savedProteinGoal: number;
  savedCarbs: number;
  savedCarbGoal: number;
  savedFats: number;
  savedFatGoal: number;
  caloriesRemaining: number;
  proteinRemaining: number;
  carbsRemaining: number;
  fatsRemaining: number;
}) {
  return (
    <Card title="Daily Progress" subtitle="See how close you are to your daily targets.">
      <div className="space-y-5">
        <ProgressRow label="Calories" current={savedCalories} goal={savedCalorieGoal} />
        <ProgressRow label="Protein" current={savedProtein} goal={savedProteinGoal} unit="g" />
        <ProgressRow label="Carbs" current={savedCarbs} goal={savedCarbGoal} unit="g" />
        <ProgressRow label="Fats" current={savedFats} goal={savedFatGoal} unit="g" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-zinc-500">Calories Remaining</p>
          <p className="mt-1 text-lg font-semibold">{caloriesRemaining}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-zinc-500">Protein Remaining</p>
          <p className="mt-1 text-lg font-semibold">{proteinRemaining}g</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-zinc-500">Carbs Remaining</p>
          <p className="mt-1 text-lg font-semibold">{carbsRemaining}g</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-zinc-500">Fats Remaining</p>
          <p className="mt-1 text-lg font-semibold">{fatsRemaining}g</p>
        </div>
      </div>
    </Card>
  );
}