import Card from "./ui/Card";

export default function TodaySummaryCard({
  recentEntriesCount,
  caloriesRemaining,
  proteinRemaining,
  savedCurrentWeight,
}: {
  recentEntriesCount: number;
  caloriesRemaining: number;
  proteinRemaining: number;
  savedCurrentWeight: number;
}) {
  return (
    <Card title="Today's Summary" subtitle="A quick look at how your day is going.">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-zinc-500">Meals Logged</p>
          <p className="mt-1 text-2xl font-semibold">{recentEntriesCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-zinc-500">Calories Left</p>
          <p className="mt-1 text-2xl font-semibold">{caloriesRemaining}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-zinc-500">Protein Left</p>
          <p className="mt-1 text-2xl font-semibold">{proteinRemaining}g</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-zinc-500">Current Weight</p>
          <p className="mt-1 text-2xl font-semibold">{savedCurrentWeight} lbs</p>
        </div>
      </div>
    </Card>
  );
}