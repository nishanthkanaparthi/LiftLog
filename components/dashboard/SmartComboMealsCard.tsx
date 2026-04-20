type SmartComboMeal = {
  title: string;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  reason: string;
};

export default function SmartComboMealsCard({
  smartCombos,
  onAddCombo,
}: {
  smartCombos: SmartComboMeal[];
  onAddCombo: (combo: SmartComboMeal) => void;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="p-6 md:p-7">
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Smart Combo Meals
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Quick add the best-fitting meal combos for where your day stands right now.
          </p>
        </div>

        <div className="space-y-3">
          {smartCombos.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
              No combo suggestions yet.
            </div>
          ) : (
            smartCombos.map((combo, index) => (
              <div
                key={`${combo.title}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-white">{combo.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{combo.reason}</p>
                    <p className="mt-3 text-sm text-zinc-500">
                      {combo.protein}g protein • {combo.carbs}g carbs • {combo.fats}g fats
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {combo.foods.join(" + ")}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-white">{combo.calories}</p>
                      <p className="text-xs text-zinc-500">calories</p>
                    </div>

                    <button
                      onClick={() => onAddCombo(combo)}
                      className="rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-90"
                    >
                      Add to Log
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}