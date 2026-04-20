import { formatPercent } from "@/lib/dashboard/helpers";
import type { DayReview, LoggedFood } from "@/lib/dashboard/types";

export function getDayReview(params: {
  savedCalories: number;
  savedProtein: number;
  savedCarbs: number;
  savedFats: number;
  savedCalorieGoal: number;
  savedProteinGoal: number;
  savedCarbGoal: number;
  savedFatGoal: number;
  savedCurrentWeight: number;
  recentEntries: LoggedFood[];
}): DayReview {
  const {
    savedCalories,
    savedProtein,
    savedCarbs,
    savedFats,
    savedCalorieGoal,
    savedProteinGoal,
    savedCarbGoal,
    savedFatGoal,
    savedCurrentWeight,
    recentEntries,
  } = params;

  const calorieProgress = savedCalorieGoal > 0 ? savedCalories / savedCalorieGoal : 0;
  const proteinProgress = savedProteinGoal > 0 ? savedProtein / savedProteinGoal : 0;
  const carbProgress = savedCarbGoal > 0 ? savedCarbs / savedCarbGoal : 0;
  const fatProgress = savedFatGoal > 0 ? savedFats / savedFatGoal : 0;

  const mealCount = recentEntries.length;
  const latestEntry = recentEntries[0]?.name ?? "";
  const bullets: string[] = [];

  const proteinGapVsCalories = proteinProgress - calorieProgress;
  const carbLead = carbProgress - Math.max(proteinProgress, fatProgress);
  const fatLead = fatProgress - Math.max(proteinProgress, carbProgress);
  const proteinLead = proteinProgress - Math.max(carbProgress, fatProgress);

  let headline = "Your day is ready to begin.";
  let status = "Nothing is logged yet, so the rest of the day is still fully flexible.";
  let focus =
    "Start with a real meal log so LiftLog can begin reading your pace and macro balance.";

  if (mealCount === 0) {
    bullets.push("No meals have been logged yet.");
    bullets.push("Your dashboard is waiting for the first signal from today.");
    if (savedCurrentWeight > 0) {
      bullets.push(`Your latest saved weight is ${savedCurrentWeight} lbs.`);
    }
    bullets.push("Once you log food, this section will start reading the pattern of your day.");

    return {
      headline,
      status,
      bullets,
      focus,
    };
  }

  if (calorieProgress > 1.02) {
    headline = "You have already pushed past your calorie target.";
    status = "The rest of the day should be intentional and controlled.";
  } else if (calorieProgress >= 0.9 && proteinProgress >= 0.85) {
    headline = "Your day is nearly locked in.";
    status = "Most of the work is already done.";
  } else if (mealCount === 1) {
    headline = "You are off the ground, but the day is still early.";
    status = "One entry gives a starting signal, not a full trend yet.";
  } else if (proteinGapVsCalories <= -0.15) {
    headline = "Calories are getting ahead of protein.";
    status = "The day is moving, but recovery support is lagging.";
  } else if (proteinLead >= 0.12) {
    headline = "Protein is leading the day well.";
    status = "That gives you room to stay flexible with the rest of your intake.";
  } else if (carbLead >= 0.15) {
    headline = "Today is leaning carb-heavy.";
    status = "Energy intake is building faster than the rest of your macro balance.";
  } else if (fatLead >= 0.15) {
    headline = "Fats are climbing faster than the rest of the day.";
    status = "You still have time to rebalance before the gap widens.";
  } else if (calorieProgress >= 0.45 && calorieProgress <= 0.75) {
    headline = "Your day is taking shape in a stable way.";
    status = "This is the key zone where small choices determine how clean the finish will be.";
  } else {
    headline = "Your day has a clear pattern now.";
    status = "There is enough data to read how the rest of the day should be handled.";
  }

  if (proteinGapVsCalories >= 0.1) {
    bullets.push("Protein intake is pacing ahead of your calorie pace, which is a strong sign.");
  } else if (proteinGapVsCalories <= -0.12) {
    bullets.push("Protein is trailing your calorie pace, so quality is falling behind quantity.");
  } else {
    bullets.push("Protein and calorie pacing are staying reasonably aligned so far.");
  }

  if (carbLead >= 0.15) {
    bullets.push("Carbs are currently the most advanced part of your day.");
  } else if (fatLead >= 0.15) {
    bullets.push("Fats are building faster than carbs and protein right now.");
  } else if (proteinLead >= 0.12) {
    bullets.push("Protein is the strongest macro category in your day right now.");
  } else {
    bullets.push("No single macro is overpowering the rest of the day.");
  }

  if (latestEntry) {
    bullets.push(`Your most recent logged item was ${latestEntry}.`);
  }

  if (calorieProgress < 0.25) {
    bullets.push("Overall intake is still light compared with your daily goal.");
  } else if (calorieProgress < 0.6) {
    bullets.push("You are still in a flexible phase where one good meal can shift the whole day.");
  } else if (calorieProgress < 0.9) {
    bullets.push("A meaningful portion of the day is already in place, so the finish matters more now.");
  } else if (calorieProgress <= 1.02) {
    bullets.push("You are close to the calorie finish line.");
  } else {
    bullets.push("You have already exceeded your calorie goal, so precision matters from here.");
  }

  if (proteinProgress < 0.35) {
    focus =
      "The biggest priority is bringing protein up before the day gets too far ahead on total calories.";
  } else if (proteinGapVsCalories <= -0.15) {
    focus =
      "The next move should be protein-driven. Right now, calories are arriving faster than recovery support.";
  } else if (carbLead >= 0.15) {
    focus =
      "Avoid letting the day drift further toward carbs. The next part of the day should pull balance back toward protein.";
  } else if (fatLead >= 0.15) {
    focus =
      "Keep the next meal cleaner and more protein-centered so fats stop outpacing the rest of the day.";
  } else if (calorieProgress >= 0.9 && proteinProgress >= 0.85) {
    focus =
      "You are close to a strong finish. Stay controlled and avoid unnecessary extra intake.";
  } else if (calorieProgress > 1.02) {
    focus =
      "You are already over the calorie goal, so the rest of the day should be light, deliberate, and not impulse-based.";
  } else if (proteinLead >= 0.12) {
    focus =
      "Protein is in a strong place. The rest of the day can focus on controlled balance rather than aggressive correction.";
  } else {
    focus =
      "Stay steady. The next meal should support balance, not force a recovery move later in the day.";
  }

  if (mealCount >= 3 && calorieProgress < 0.35) {
    status = "You have logged enough to show a pattern, but total intake is still very light.";
    focus =
      "You need real intake soon, or the rest of the day will become harder to manage cleanly.";
  }

  if (savedCalorieGoal > 0 && savedProteinGoal > 0) {
    bullets.push(
      `You are at ${formatPercent(calorieProgress)}% of calories and ${formatPercent(
        proteinProgress
      )}% of protein.`
    );
  }

  return {
    headline,
    status,
    bullets: bullets.slice(0, 4),
    focus,
  };
}