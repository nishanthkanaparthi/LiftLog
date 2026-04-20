type HistoryDaySummary = {
  dateKey: string;
  label: string;
  entryCount: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type FoodHistoryCardProps = {
  historyDays: HistoryDaySummary[];
};

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function formatMacro(value: number) {
  const rounded = round1(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export default function FoodHistoryCard({
  historyDays,
}: FoodHistoryCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="p-6 md:p-7">
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Food History
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Your last 7 previous daily summaries.
          </p>
        </div>

        {historyDays.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-zinc-400">
            No previous daily history yet.
          </div>
        ) : (
          <div className="space-y-4">
            {historyDays.map((day) => (
              <div
                key={day.dateKey}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-medium text-white">{day.label}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {day.entryCount} {day.entryCount === 1 ? "meal" : "meals"}
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      {formatMacro(day.protein)}g protein •{" "}
                      {formatMacro(day.carbs)}g carbs •{" "}
                      {formatMacro(day.fats)}g fats
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-2xl font-semibold text-white">
                      {formatMacro(day.calories)}
                    </p>
                    <p className="text-sm text-zinc-500">calories</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}