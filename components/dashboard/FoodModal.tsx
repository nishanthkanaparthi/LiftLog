type FoodItem = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type FoodModalProps = {
  showFoodModal: boolean;
  modalMode: "found" | "suggestion" | "manual";
  suggestedFood: FoodItem | null;
  foodName: string;
  setFoodName: (value: string) => void;
  calories: string;
  setCalories: (value: string) => void;
  protein: string;
  setProtein: (value: string) => void;
  carbs: string;
  setCarbs: (value: string) => void;
  fats: string;
  setFats: (value: string) => void;
  onUseSuggestedFood: () => void;
  onLogMacros: () => void;
  onCancel: () => void;
  onEnterLabelMacros: () => void;
  isEditing?: boolean;
};

function renderHeading(
  modalMode: "found" | "suggestion" | "manual",
  isEditing: boolean
) {
  if (isEditing) {
    return "Edit Logged Meal";
  }

  if (modalMode === "suggestion") {
    return "Closest Match Found";
  }

  if (modalMode === "manual") {
    return "Enter Macros Manually";
  }

  return "Food Found";
}

function renderDescription(
  modalMode: "found" | "suggestion" | "manual",
  isEditing: boolean,
  foodName: string,
  suggestedFood: FoodItem | null
) {
  if (isEditing) {
    return "Update the meal name and macros below, then save your changes.";
  }

  if (modalMode === "suggestion") {
    return `We didn’t find an exact match for "${foodName}". Here’s the closest result.`;
  }

  if (modalMode === "manual") {
    return "Enter the nutrition values for this food manually.";
  }

  return `Review the macros for "${suggestedFood?.name || foodName}" before logging it.`;
}

export default function FoodModal({
  showFoodModal,
  modalMode,
  suggestedFood,
  foodName,
  setFoodName,
  calories,
  setCalories,
  protein,
  setProtein,
  carbs,
  setCarbs,
  fats,
  setFats,
  onUseSuggestedFood,
  onLogMacros,
  onCancel,
  onEnterLabelMacros,
  isEditing = false,
}: FoodModalProps) {
  if (!showFoodModal) return null;

  const title = renderHeading(modalMode, isEditing);
  const description = renderDescription(
    modalMode,
    isEditing,
    foodName,
    suggestedFood
  );

  const primaryButtonText = isEditing ? "Save Changes" : "Log Food";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111113] shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm text-zinc-400">{description}</p>
        </div>

        <div className="space-y-5 px-6 py-6">
          {modalMode === "suggestion" && suggestedFood && !isEditing && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-lg font-semibold text-white">{suggestedFood.name}</p>
              <p className="mt-2 text-sm text-zinc-400">
                {suggestedFood.calories} cal • {suggestedFood.protein}g protein •{" "}
                {suggestedFood.carbs}g carbs • {suggestedFood.fats}g fats
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={onUseSuggestedFood}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                >
                  Use This Food
                </button>

                <button
                  onClick={onEnterLabelMacros}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                >
                  Enter Manually Instead
                </button>
              </div>
            </div>
          )}

          {(modalMode === "found" || modalMode === "manual" || isEditing) && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Food Name
                </label>
                <input
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  readOnly={!isEditing && modalMode === "found"}
                  className={`w-full rounded-2xl border px-4 py-3 text-white outline-none transition ${
                    !isEditing && modalMode === "found"
                      ? "border-white/5 bg-white/[0.03] text-zinc-400"
                      : "border-white/10 bg-white/[0.05] focus:border-white/20"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-white/20"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-white/20"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-white/20"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-white/20"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08]"
          >
            Cancel
          </button>

          {(modalMode === "found" || modalMode === "manual" || isEditing) && (
            <button
              onClick={onLogMacros}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              {primaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}