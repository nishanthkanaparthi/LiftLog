type LoggedFood = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt: string;
};

type RecentFoodEntriesCardProps = {
  recentEntries: LoggedFood[];
  onEditFood: (entry: LoggedFood) => void;
  onDeleteFood: (id: string) => void;
  isDeletingFoodId: string | null;
};

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function formatMacro(value: number) {
  const rounded = round1(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export default function RecentFoodEntriesCard({
  recentEntries,
  onEditFood,
  onDeleteFood,
  isDeletingFoodId,
}: RecentFoodEntriesCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="p-6 md:p-7">
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Recent Food Entries
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Your latest logged foods for today.
          </p>
        </div>

        {recentEntries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-zinc-400">
            No foods logged yet today.
          </div>
        ) : (
          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-lg font-medium text-white truncate">
                          {entry.name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {formatMacro(entry.protein)}g protein •{" "}
                          {formatMacro(entry.carbs)}g carbs •{" "}
                          {formatMacro(entry.fats)}g fats
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-2xl font-semibold text-white">
                          {formatMacro(entry.calories)}
                        </p>
                        <p className="text-sm text-zinc-500">calories</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:shrink-0">
                    <button
                      onClick={() => onEditFood(entry)}
                      className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.09]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDeleteFood(entry.id)}
                      disabled={isDeletingFoodId === entry.id}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeletingFoodId === entry.id ? "Removing..." : "Delete"}
                    </button>
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