import type { BaseComboMeal, SmartComboMeal } from "@/lib/dashboard/types";

export const BASE_COMBO_MEALS: BaseComboMeal[] = [
  {
    name: "Chicken + Rice Bowl",
    calories: 295,
    protein: 33,
    carbs: 28,
    fats: 4,
  },
  {
    name: "Oats + Whey + Banana",
    calories: 385,
    protein: 29,
    carbs: 63,
    fats: 3.5,
  },
  {
    name: "Eggs + Bread + Milk",
    calories: 360,
    protein: 24,
    carbs: 24,
    fats: 19,
  },
  {
    name: "Greek Yogurt + Banana + Almonds",
    calories: 328,
    protein: 17,
    carbs: 37,
    fats: 14,
  },
  {
    name: "Paneer + Rice Plate",
    calories: 395,
    protein: 20,
    carbs: 31,
    fats: 21,
  },
];

export function getSmartCombos(params: {
  calorieRemaining: number;
  proteinRemaining: number;
  carbRemaining: number;
  fatRemaining: number;
  savedCalories: number;
  savedCalorieGoal: number;
  savedProtein: number;
  savedProteinGoal: number;
}): SmartComboMeal[] {
  const {
    calorieRemaining,
    proteinRemaining,
    carbRemaining,
    fatRemaining,
    savedCalories,
    savedCalorieGoal,
    savedProtein,
    savedProteinGoal,
  } = params;

  const calorieProgress = savedCalorieGoal > 0 ? savedCalories / savedCalorieGoal : 0;
  const proteinProgress = savedProteinGoal > 0 ? savedProtein / savedProteinGoal : 0;

  const smartCombos: SmartComboMeal[] = BASE_COMBO_MEALS.map((combo) => {
    let score = 0;

    score += Math.min(combo.protein, Math.max(proteinRemaining, 0)) * 3.2;
    score += Math.min(combo.carbs, Math.max(carbRemaining, 0)) * 2.1;
    score += Math.min(combo.fats, Math.max(fatRemaining, 0)) * 1.4;
    score += Math.min(combo.calories, Math.max(calorieRemaining, 0)) * 0.045;

    if (proteinRemaining > carbRemaining && proteinRemaining > fatRemaining) {
      score += combo.protein * 1.8;
    }

    if (carbRemaining > proteinRemaining && carbRemaining > fatRemaining) {
      score += combo.carbs * 1.25;
    }

    if (fatRemaining > proteinRemaining && fatRemaining > carbRemaining) {
      score += combo.fats * 1.15;
    }

    if (calorieRemaining > 700) {
      score += combo.calories * 0.05;
    }

    if (calorieRemaining < 250) {
      score -= combo.calories * 0.06;
    }

    if (calorieProgress > 0.8) {
      score -= combo.calories * 0.04;
    }

    if (proteinProgress < 0.5) {
      score += combo.protein * 1.4;
    }

    let tag = "Balanced";
    let reason = "Solid overall option for where your day stands right now.";

    const proteinDensity = combo.protein / Math.max(combo.calories, 1);
    const carbDensity = combo.carbs / Math.max(combo.calories, 1);
    const fatDensity = combo.fats / Math.max(combo.calories, 1);

    if (proteinRemaining >= carbRemaining && proteinRemaining >= fatRemaining) {
      if (combo.protein >= 28 || proteinDensity > 0.09) {
        tag = "Best for Protein";
        reason = "You are still chasing protein, and this combo closes that gap efficiently.";
        score += 18;
      } else if (combo.protein >= 20) {
        tag = "Protein Support";
        reason = "This helps move protein up without pushing the rest of the day too hard.";
        score += 10;
      }
    }

    if (
      carbRemaining > proteinRemaining &&
      carbRemaining >= fatRemaining &&
      combo.carbs >= 35
    ) {
      tag = "Carb Boost";
      reason =
        "You still have room on carbs, and this combo pushes energy intake forward quickly.";
      score += 12;
    }

    if (
      fatRemaining > proteinRemaining &&
      fatRemaining > carbRemaining &&
      combo.fats >= 12
    ) {
      tag = "Higher Fat";
      reason =
        "Fats are still open for the day, and this combo helps fill that space naturally.";
      score += 9;
    }

    if (calorieRemaining > 800 && combo.calories >= 350) {
      tag = "Calorie Boost";
      reason =
        "You still have a lot of calories left, and this moves the day forward efficiently.";
      score += 11;
    }

    if (calorieRemaining < 350 && combo.calories <= 330) {
      tag = "Light Option";
      reason = "This keeps progress moving without overshooting the end of the day.";
      score += 8;
    }

    if (
      Math.abs(proteinRemaining - combo.protein) < 15 &&
      Math.abs(carbRemaining - combo.carbs) < 20 &&
      calorieRemaining > combo.calories
    ) {
      tag = "Best Match";
      reason = "This combo lines up especially well with what is still left in your day.";
      score += 22;
    }

    if (proteinDensity > carbDensity && proteinDensity > fatDensity && proteinRemaining > 0) {
      score += 4;
    }

    return {
      ...combo,
      tag,
      reason,
      score,
    };
  });

  return smartCombos.sort((a, b) => b.score - a.score).slice(0, 3);
}