"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import LogFoodCard from "@/components/dashboard/LogFoodCard";
import RecentFoodEntriesCard from "@/components/dashboard/RecentFoodEntriesCard";
import WeightTrackingCard from "@/components/dashboard/WeightTrackingCard";
import UpdateGoalsCard from "@/components/dashboard/UpdateGoalsCard";
import TodaySummaryCard from "@/components/dashboard/TodaySummaryCard";
import GoalsOverviewCard from "@/components/dashboard/GoalsOverviewCard";
import DailyProgressCard from "@/components/dashboard/DailyProgressCard";
import AccountCard from "@/components/dashboard/AccountCard";
import FoodModal from "@/components/dashboard/FoodModal";
import SmartComboMealsCard from "@/components/dashboard/SmartComboMealsCard";
import FoodHistory from "@/components/dashboard/FoodHistory";

type FoodItem = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type LoggedFood = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt: string;
};

type SmartComboMeal = {
  title: string;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  reason: string;
};

type HistoryDaySummary = {
  dateKey: string;
  label: string;
  entryCount: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type MessageType = "success" | "error" | "";

type GoalResponse = {
  calorieGoal?: number;
  proteinGoal?: number;
  carbGoal?: number;
  fatGoal?: number;
  weightGoal?: number;
};

type WeightResponse = {
  weight?: number;
};

type FoodSearchResponse = {
  foods?: FoodItem[];
};

type ApiErrorResponse = {
  error?: string;
  details?: string;
};

function normalizeText(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function isValidNumber(value: string) {
  if (value.trim() === "") return false;
  const num = Number(value);
  return !Number.isNaN(num);
}

function getProgress(current: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min((current / goal) * 100, 100);
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function formatMacro(value: number) {
  const rounded = round1(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function getLocalDateKey(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatHistoryLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function hasNoSavedGoals(goals: GoalResponse | null | undefined) {
  const calorieGoal = goals?.calorieGoal ?? 0;
  const proteinGoal = goals?.proteinGoal ?? 0;
  const carbGoal = goals?.carbGoal ?? 0;
  const fatGoal = goals?.fatGoal ?? 0;
  const weightGoal = goals?.weightGoal ?? 0;

  return (
    calorieGoal <= 0 &&
    proteinGoal <= 0 &&
    carbGoal <= 0 &&
    fatGoal <= 0 &&
    weightGoal <= 0
  );
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    ...init,
  });

  let data: T | ApiErrorResponse | null = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      (data as ApiErrorResponse | null)?.error ||
      (data as ApiErrorResponse | null)?.details ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data as T;
}

function buildSmartCombos(
  caloriesRemaining: number,
  proteinRemaining: number,
  carbsRemaining: number,
  fatsRemaining: number,
  excludedTitles: string[] = []
): SmartComboMeal[] {
  const baseCombos: SmartComboMeal[] = [
    {
      title: "Chicken Rice Bowl",
      foods: ["Chicken Breast", "White Rice"],
      calories: 520,
      protein: 48,
      carbs: 52,
      fats: 9,
      reason: "High protein balanced meal",
    },
    {
      title: "Oats and Whey",
      foods: ["Oats", "Whey Protein", "Milk"],
      calories: 430,
      protein: 35,
      carbs: 45,
      fats: 10,
      reason: "Easy pre or post workout option",
    },
    {
      title: "Egg and Toast Combo",
      foods: ["4 Eggs", "Whole Wheat Bread"],
      calories: 410,
      protein: 28,
      carbs: 26,
      fats: 20,
      reason: "Solid breakfast-style option",
    },
    {
      title: "Greek Yogurt Bowl",
      foods: ["Greek Yogurt", "Banana", "Honey"],
      calories: 320,
      protein: 24,
      carbs: 42,
      fats: 3,
      reason: "Light and easy snack meal",
    },
    {
      title: "Peanut Butter Sandwich",
      foods: ["Whole Wheat Bread", "Peanut Butter", "Banana"],
      calories: 470,
      protein: 17,
      carbs: 49,
      fats: 22,
      reason: "Good calorie bump",
    },
    {
      title: "Chicken and Potatoes",
      foods: ["Chicken Breast", "Air-Fried Potatoes"],
      calories: 460,
      protein: 42,
      carbs: 38,
      fats: 11,
      reason: "Lean meal with moderate carbs",
    },
    {
      title: "Cottage Cheese Pasta",
      foods: ["Pasta", "Cottage Cheese Sauce"],
      calories: 540,
      protein: 32,
      carbs: 62,
      fats: 14,
      reason: "Higher-carb dinner option",
    },
    {
      title: "Rice and Dahi Plate",
      foods: ["White Rice", "Dahi", "Chicken Breast"],
      calories: 500,
      protein: 39,
      carbs: 50,
      fats: 10,
      reason: "Simple bulk-friendly plate",
    },
  ];

  const filteredBaseCombos =
    excludedTitles.length > 0
      ? baseCombos.filter((combo) => !excludedTitles.includes(combo.title))
      : baseCombos;

  const combosToScore =
    filteredBaseCombos.length >= 3 ? filteredBaseCombos : baseCombos;

  return combosToScore
    .map((combo) => {
      const calorieOver = Math.max(combo.calories - caloriesRemaining, 0);
      const proteinOver = Math.max(combo.protein - proteinRemaining, 0);
      const carbsOver = Math.max(combo.carbs - carbsRemaining, 0);
      const fatsOver = Math.max(combo.fats - fatsRemaining, 0);

      const calorieFit =
        caloriesRemaining > 0
          ? 1 -
            Math.abs(caloriesRemaining - combo.calories) /
              Math.max(caloriesRemaining, combo.calories)
          : 0;

      const proteinFit =
        proteinRemaining > 0
          ? 1 -
            Math.abs(proteinRemaining - combo.protein) /
              Math.max(proteinRemaining, combo.protein)
          : 0;

      const carbsFit =
        carbsRemaining > 0
          ? 1 -
            Math.abs(carbsRemaining - combo.carbs) /
              Math.max(carbsRemaining, combo.carbs)
          : 0;

      let score = 0;

      score += Math.min(combo.protein, Math.max(proteinRemaining, 0)) * 3.8;
      score += Math.min(combo.carbs, Math.max(carbsRemaining, 0)) * 1.6;
      score += Math.min(combo.calories, Math.max(caloriesRemaining, 0)) * 0.09;

      score += calorieFit * 120;
      score += proteinFit * 150;
      score += carbsFit * 50;

      score -= calorieOver * 0.6;
      score -= proteinOver * 2.4;
      score -= carbsOver * 0.9;
      score -= fatsOver * 1.4;

      if (caloriesRemaining < 450 && combo.calories > caloriesRemaining) {
        score -= 120;
      }

      if (proteinRemaining < 25 && combo.protein > proteinRemaining + 12) {
        score -= 65;
      }

      if (excludedTitles.includes(combo.title)) {
        score -= 1000;
      }

      return { ...combo, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, ...combo }) => combo);
}

function DashboardPanel({
  children,
  variant = "standard",
}: {
  children: ReactNode;
  variant?: "standard" | "primary" | "utility";
}) {
  const buttonClasses =
    variant === "primary"
      ? [
          "[&_button]:border",
          "[&_button]:border-[#61BEFF]/40",
          "[&_button]:bg-[#4CB4FF]",
          "[&_button]:text-[#03111d]",
          "[&_button]:shadow-[0_0_26px_rgba(76,180,255,0.28)]",
          "[&_button:hover]:bg-[#76CAFF]",
          "[&_button:hover]:shadow-[0_0_34px_rgba(76,180,255,0.38)]",
        ].join(" ")
      : [
          "[&_button]:border",
          "[&_button]:border-[#1A5E98]",
          "[&_button]:bg-[#07111d]",
          "[&_button]:text-white",
          "[&_button]:shadow-[0_10px_24px_rgba(0,0,0,0.34)]",
          "[&_button:hover]:bg-[#0c1726]",
          "[&_button:hover]:border-[#2A7BC0]",
        ].join(" ");

  return (
    <div className={`relative ${buttonClasses} [&_button]:transition`}>
      <div className="pointer-events-none absolute -inset-2 rounded-[34px] bg-[radial-gradient(circle_at_top_left,rgba(82,170,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,120,255,0.20),transparent_38%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-[28px] border border-[#0B65B8] bg-[#04070d] shadow-[0_28px_70px_rgba(0,0,0,0.60)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(82,170,255,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,120,255,0.08),transparent_28%)]" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

function NeonMetricValue({ children }: { children: ReactNode }) {
  return (
    <span className="bg-[linear-gradient(90deg,#2157F2_0%,#2A79FF_35%,#4FA5FF_70%,#7CC4FF_100%)] bg-clip-text text-transparent">
      {children}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  const [calorieGoal, setCalorieGoal] = useState("");
  const [proteinGoal, setProteinGoal] = useState("");
  const [carbGoal, setCarbGoal] = useState("");
  const [fatGoal, setFatGoal] = useState("");
  const [weightGoal, setWeightGoal] = useState("");

  const [savedCalorieGoal, setSavedCalorieGoal] = useState(0);
  const [savedProteinGoal, setSavedProteinGoal] = useState(0);
  const [savedCarbGoal, setSavedCarbGoal] = useState(0);
  const [savedFatGoal, setSavedFatGoal] = useState(0);
  const [savedWeightGoal, setSavedWeightGoal] = useState(0);

  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  const [savedCalories, setSavedCalories] = useState(0);
  const [savedProtein, setSavedProtein] = useState(0);
  const [savedCarbs, setSavedCarbs] = useState(0);
  const [savedFats, setSavedFats] = useState(0);

  const [currentWeight, setCurrentWeight] = useState("");
  const [savedCurrentWeight, setSavedCurrentWeight] = useState(0);

  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("");

  const [showFoodModal, setShowFoodModal] = useState(false);
  const [modalMode, setModalMode] = useState<"found" | "suggestion" | "manual">(
    "found"
  );
  const [suggestedFood, setSuggestedFood] = useState<FoodItem | null>(null);

  const [recentEntries, setRecentEntries] = useState<LoggedFood[]>([]);
  const [allFoodLogs, setAllFoodLogs] = useState<LoggedFood[]>([]);

  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [isDeletingFoodId, setIsDeletingFoodId] = useState<string | null>(null);

  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [foodToDeleteId, setFoodToDeleteId] = useState<string | null>(null);
  const [foodToDeleteName, setFoodToDeleteName] = useState("");
  const [isConfirmDeleting, setIsConfirmDeleting] = useState(false);

  const [excludedSmartComboTitles, setExcludedSmartComboTitles] = useState<string[]>([]);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isOnboardingFlow, setIsOnboardingFlow] = useState(false);

  const todayDateKey = useMemo(() => getTodayDateKey(), []);

  const todayFoodLogs = useMemo(() => {
    return allFoodLogs.filter((item) => getLocalDateKey(item.createdAt) === todayDateKey);
  }, [allFoodLogs, todayDateKey]);

  const historyDays = useMemo(() => {
    const grouped = new Map<string, HistoryDaySummary>();

    allFoodLogs.forEach((item) => {
      const dateKey = getLocalDateKey(item.createdAt);

      if (dateKey === todayDateKey) return;

      const existing = grouped.get(dateKey);

      if (existing) {
        existing.entryCount += 1;
        existing.calories += item.calories;
        existing.protein += item.protein;
        existing.carbs += item.carbs;
        existing.fats += item.fats;
        return;
      }

      grouped.set(dateKey, {
        dateKey,
        label: formatHistoryLabel(dateKey),
        entryCount: 1,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
      });
    });

    return Array.from(grouped.values())
      .sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1))
      .slice(0, 7)
      .map((day) => ({
        ...day,
        calories: round1(day.calories),
        protein: round1(day.protein),
        carbs: round1(day.carbs),
        fats: round1(day.fats),
      }));
  }, [allFoodLogs, todayDateKey]);

  const showError = (text: string) => {
    setMessageText(text);
    setMessageType("error");
  };

  const showSuccess = (text: string) => {
    setMessageText(text);
    setMessageType("success");

    window.clearTimeout((showSuccess as unknown as { timeout?: number }).timeout);

    (showSuccess as unknown as { timeout?: number }).timeout = window.setTimeout(() => {
      setMessageText("");
      setMessageType("");
    }, 2200);
  };

  const resetFoodForm = () => {
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFats("");
    setSuggestedFood(null);
    setEditingFoodId(null);
    setModalMode("found");
  };

  const closeFoodModal = () => {
    setShowFoodModal(false);
    resetFoodForm();
  };

  const loadGoals = async (currentUserId: string): Promise<GoalResponse> => {
    const data = await fetchJson<GoalResponse>(`/api/goals?userId=${currentUserId}`);

    setSavedCalorieGoal(data.calorieGoal ?? 0);
    setSavedProteinGoal(data.proteinGoal ?? 0);
    setSavedCarbGoal(data.carbGoal ?? 0);
    setSavedFatGoal(data.fatGoal ?? 0);
    setSavedWeightGoal(data.weightGoal ?? 0);

    return data;
  };

  const loadFoods = async (currentUserId: string) => {
    const data = await fetchJson<LoggedFood[]>(`/api/foods?userId=${currentUserId}`);

    setAllFoodLogs(data);

    const todayLogs = data.filter(
      (item) => getLocalDateKey(item.createdAt) === getTodayDateKey()
    );

    setRecentEntries(todayLogs.slice(0, 4));

    const totalCalories = todayLogs.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = todayLogs.reduce((sum, item) => sum + item.protein, 0);
    const totalCarbs = todayLogs.reduce((sum, item) => sum + item.carbs, 0);
    const totalFats = todayLogs.reduce((sum, item) => sum + item.fats, 0);

    setSavedCalories(totalCalories);
    setSavedProtein(totalProtein);
    setSavedCarbs(totalCarbs);
    setSavedFats(totalFats);
  };

  const loadWeight = async (currentUserId: string) => {
    const data = await fetchJson<WeightResponse>(`/api/weight?userId=${currentUserId}`);
    setSavedCurrentWeight(data.weight ?? 0);
  };

  const loadDashboardData = async (currentUserId: string) => {
    setIsDashboardLoading(true);

    const results = await Promise.allSettled([
      loadGoals(currentUserId),
      loadFoods(currentUserId),
      loadWeight(currentUserId),
    ]);

    const failedSections: string[] = [];

    if (results[0].status === "rejected") {
      failedSections.push("goals");
      console.error("Error loading goals:", results[0].reason);
    }

    if (results[1].status === "rejected") {
      failedSections.push("food logs");
      console.error("Error loading food logs:", results[1].reason);
    }

    if (results[2].status === "rejected") {
      failedSections.push("weight");
      console.error("Error loading weight:", results[2].reason);
    }

    if (failedSections.length > 0) {
      showError(`Failed to load ${failedSections.join(", ")}.`);
    }

    if (results[0].status === "fulfilled") {
      const goalsData = results[0].value;
      const needsOnboarding = hasNoSavedGoals(goalsData);

      if (needsOnboarding) {
        setIsOnboardingFlow(true);
        setShowWelcomeModal(true);
      } else {
        setIsOnboardingFlow(false);
        setShowWelcomeModal(false);
      }
    }

    setIsDashboardLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("liftlogUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser?.id) {
        localStorage.removeItem("liftlogUser");
        router.push("/login");
        return;
      }

      setUserId(parsedUser.id);
    } catch {
      localStorage.removeItem("liftlogUser");
      router.push("/login");
      return;
    } finally {
      setIsAuthLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    loadDashboardData(userId);
  }, [userId]);

  const handleStartOnboarding = () => {
    setShowWelcomeModal(false);
    setShowGoalsModal(true);
  };

  const handleSaveGoals = async () => {
    if (!userId) {
      showError("No logged-in user found.");
      return;
    }

    if (
      !isValidNumber(calorieGoal) ||
      !isValidNumber(proteinGoal) ||
      !isValidNumber(carbGoal) ||
      !isValidNumber(fatGoal) ||
      !isValidNumber(weightGoal)
    ) {
      showError("Please enter valid numbers for all goal fields.");
      return;
    }

    const calorieGoalNum = Number(calorieGoal);
    const proteinGoalNum = Number(proteinGoal);
    const carbGoalNum = Number(carbGoal);
    const fatGoalNum = Number(fatGoal);
    const weightGoalNum = Number(weightGoal);

    if (calorieGoalNum <= 0 || weightGoalNum <= 0) {
      showError("Calorie goal and weight goal must be greater than 0.");
      return;
    }

    if (proteinGoalNum < 0 || carbGoalNum < 0 || fatGoalNum < 0) {
      showError("Protein, carbs, and fats goals cannot be negative.");
      return;
    }

    try {
      await fetchJson<{ message: string }>("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          calorieGoal: calorieGoalNum,
          proteinGoal: proteinGoalNum,
          carbGoal: carbGoalNum,
          fatGoal: fatGoalNum,
          weightGoal: weightGoalNum,
        }),
      });

      await loadGoals(userId);

      setCalorieGoal("");
      setProteinGoal("");
      setCarbGoal("");
      setFatGoal("");
      setWeightGoal("");

      setShowGoalsModal(false);

      if (isOnboardingFlow) {
        setShowWeightModal(true);
        showSuccess("Goals saved. Now enter your current weight.");
        return;
      }

      showSuccess("Goals saved successfully.");
    } catch (error) {
      console.error("Error saving goals:", error);
      showError(error instanceof Error ? error.message : "Failed to save goals.");
    }
  };

  const handleUpdateWeight = async () => {
    if (!userId) {
      showError("No logged-in user found.");
      return;
    }

    if (!isValidNumber(currentWeight)) {
      showError("Please enter a valid current weight.");
      return;
    }

    const currentWeightNum = Number(currentWeight);

    if (currentWeightNum <= 0) {
      showError("Current weight must be greater than 0.");
      return;
    }

    try {
      await fetchJson<{ message: string }>("/api/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          weight: currentWeightNum,
        }),
      });

      await loadWeight(userId);

      setCurrentWeight("");
      setShowWeightModal(false);

      if (isOnboardingFlow) {
        setShowWelcomeModal(false);
        setIsOnboardingFlow(false);
        showSuccess("Setup complete. Your dashboard is ready.");
        return;
      }

      showSuccess("Weight updated successfully.");
    } catch (error) {
      console.error("Error saving weight:", error);
      showError(error instanceof Error ? error.message : "Failed to save weight.");
    }
  };

  const openFoundFoodModal = (food: FoodItem) => {
    setSuggestedFood(food);
    setFoodName(food.name);
    setCalories(String(food.calories));
    setProtein(String(food.protein));
    setCarbs(String(food.carbs));
    setFats(String(food.fats));
    setModalMode("found");
    setEditingFoodId(null);
    setShowFoodModal(true);
  };

  const openSuggestionModal = (food: FoodItem) => {
    setSuggestedFood(food);
    setCalories(String(food.calories));
    setProtein(String(food.protein));
    setCarbs(String(food.carbs));
    setFats(String(food.fats));
    setModalMode("suggestion");
    setEditingFoodId(null);
    setShowFoodModal(true);
  };

  const openManualModal = () => {
    setSuggestedFood(null);
    setCalories("");
    setProtein("");
    setCarbs("");
    setFats("");
    setModalMode("manual");
    setEditingFoodId(null);
    setShowFoodModal(true);
  };

  const searchFoods = async (query: string) => {
    try {
      const first = await fetchJson<FoodSearchResponse>(
        `/api/food-search?query=${encodeURIComponent(query)}`
      );

      if ((first.foods ?? []).length > 0) {
        return first.foods ?? [];
      }
    } catch {
      // fall through
    }

    try {
      const fallback = await fetchJson<FoodSearchResponse>(
        `/api/food-search?q=${encodeURIComponent(query)}`
      );

      return fallback.foods ?? [];
    } catch {
      return [];
    }
  };

  const handleFindFood = async () => {
    const cleaned = normalizeText(foodName);

    if (cleaned === "") {
      showError("Please enter a food name.");
      return;
    }

    try {
      const results = await searchFoods(foodName);

      if (results.length === 0) {
        openManualModal();
        return;
      }

      const exactMatch = results.find(
        (food) => normalizeText(food.name) === cleaned
      );

      if (exactMatch) {
        openFoundFoodModal(exactMatch);
        return;
      }

      openSuggestionModal(results[0]);
    } catch (error) {
      console.error("Error finding food:", error);
      showError("Unable to search the food database right now.");
    }
  };

  const handleUseSuggestedFood = async () => {
    if (!userId) {
      showError("No logged-in user found.");
      return;
    }

    if (!suggestedFood) {
      showError("No suggested food found.");
      return;
    }

    try {
      await fetchJson<{ message: string }>("/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: suggestedFood.name,
          calories: suggestedFood.calories,
          protein: suggestedFood.protein,
          carbs: suggestedFood.carbs,
          fats: suggestedFood.fats,
        }),
      });

      await loadFoods(userId);
      closeFoodModal();
      showSuccess(`${suggestedFood.name} logged successfully.`);
    } catch (error) {
      console.error("Error logging suggested food:", error);
      showError(
        error instanceof Error ? error.message : "Failed to log suggested food."
      );
    }
  };

  const handleEditFood = (entry: LoggedFood) => {
    setEditingFoodId(entry.id);
    setSuggestedFood(null);
    setFoodName(entry.name);
    setCalories(String(entry.calories));
    setProtein(String(entry.protein));
    setCarbs(String(entry.carbs));
    setFats(String(entry.fats));
    setModalMode("manual");
    setShowFoodModal(true);
  };

  const handleDeleteFood = (entryId: string) => {
    const entry = recentEntries.find((item) => item.id === entryId);

    setFoodToDeleteId(entryId);
    setFoodToDeleteName(entry?.name ?? "this logged meal");
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteFood = async () => {
    if (!userId) {
      showError("No logged-in user found.");
      return;
    }

    if (!foodToDeleteId) {
      showError("No food selected for deletion.");
      return;
    }

    try {
      setIsConfirmDeleting(true);
      setIsDeletingFoodId(foodToDeleteId);

      await fetchJson<{ message: string }>("/api/foods", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: foodToDeleteId,
          userId,
        }),
      });

      await loadFoods(userId);
      setShowDeleteModal(false);
      setFoodToDeleteId(null);
      setFoodToDeleteName("");
      showSuccess("Logged meal removed.");
    } catch (error) {
      console.error("Error deleting food log:", error);
      showError(
        error instanceof Error ? error.message : "Failed to delete logged meal."
      );
    } finally {
      setIsConfirmDeleting(false);
      setIsDeletingFoodId(null);
    }
  };

  const handleCancelDeleteFood = () => {
    if (isConfirmDeleting) return;
    setShowDeleteModal(false);
    setFoodToDeleteId(null);
    setFoodToDeleteName("");
  };

  const handleLogMacros = async () => {
    if (!userId) {
      showError("No logged-in user found.");
      return;
    }

    if (
      !isValidNumber(calories) ||
      !isValidNumber(protein) ||
      !isValidNumber(carbs) ||
      !isValidNumber(fats)
    ) {
      showError("Please enter valid numbers for all macro fields.");
      return;
    }

    const caloriesNum = Number(calories);
    const proteinNum = Number(protein);
    const carbsNum = Number(carbs);
    const fatsNum = Number(fats);

    if (caloriesNum <= 0) {
      showError("Calories must be greater than 0.");
      return;
    }

    if (proteinNum < 0 || carbsNum < 0 || fatsNum < 0) {
      showError("Protein, carbs, and fats cannot be negative.");
      return;
    }

    const finalFoodName = foodName.trim() || suggestedFood?.name || "Custom Food";

    try {
      if (editingFoodId) {
        await fetchJson<{ message: string }>("/api/foods", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingFoodId,
            userId,
            name: finalFoodName,
            calories: caloriesNum,
            protein: proteinNum,
            carbs: carbsNum,
            fats: fatsNum,
          }),
        });

        await loadFoods(userId);
        closeFoodModal();
        showSuccess("Logged meal updated successfully.");
        return;
      }

      await fetchJson<{ message: string }>("/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: finalFoodName,
          calories: caloriesNum,
          protein: proteinNum,
          carbs: carbsNum,
          fats: fatsNum,
        }),
      });

      await loadFoods(userId);
      closeFoodModal();
      showSuccess("Food logged successfully.");
    } catch (error) {
      console.error("Error saving food log:", error);
      showError(error instanceof Error ? error.message : "Failed to save food log.");
    }
  };

  const rawCaloriesRemaining = Math.max(savedCalorieGoal - savedCalories, 0);
  const rawProteinRemaining = Math.max(savedProteinGoal - savedProtein, 0);
  const rawCarbsRemaining = Math.max(savedCarbGoal - savedCarbs, 0);
  const rawFatsRemaining = Math.max(savedFatGoal - savedFats, 0);

  const caloriesRemaining = round1(rawCaloriesRemaining);
  const proteinRemaining = round1(rawProteinRemaining);
  const carbsRemaining = round1(rawCarbsRemaining);
  const fatsRemaining = round1(rawFatsRemaining);

  const smartCombos = useMemo(
    () =>
      buildSmartCombos(
        rawCaloriesRemaining,
        rawProteinRemaining,
        rawCarbsRemaining,
        rawFatsRemaining,
        excludedSmartComboTitles
      ),
    [
      rawCaloriesRemaining,
      rawProteinRemaining,
      rawCarbsRemaining,
      rawFatsRemaining,
      excludedSmartComboTitles,
    ]
  );

  const progressTone = useMemo(() => {
    const calorieProgress = getProgress(savedCalories, savedCalorieGoal);
    const proteinProgress = getProgress(savedProtein, savedProteinGoal);

    if (calorieProgress >= 90 && proteinProgress >= 90) {
      return {
        headline: "You’re finishing strong.",
        description: "Calories and protein are both close to target.",
      };
    }

    if (savedCalories === 0 && todayFoodLogs.length === 0) {
      return {
        headline: "Your day is still open.",
        description: "Start logging meals and the dashboard will build out automatically.",
      };
    }

    if (rawProteinRemaining > rawCaloriesRemaining / 12) {
      return {
        headline: "Protein is your biggest gap right now.",
        description: "Focus on a protein-heavy food next.",
      };
    }

    if (rawCaloriesRemaining > 600) {
      return {
        headline: "You still have room to work with.",
        description: "A couple more meals can still fit comfortably today.",
      };
    }

    return {
      headline: "You’re moving in the right direction.",
      description: "Keep logging consistently and adjust as needed.",
    };
  }, [
    savedCalories,
    savedCalorieGoal,
    savedProtein,
    savedProteinGoal,
    todayFoodLogs.length,
    rawProteinRemaining,
    rawCaloriesRemaining,
  ]);

  const handleAddCombo = async (combo: SmartComboMeal) => {
    if (!userId) {
      showError("No logged-in user found.");
      return;
    }

    try {
      await fetchJson<{ message: string }>("/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: combo.title,
          calories: combo.calories,
          protein: combo.protein,
          carbs: combo.carbs,
          fats: combo.fats,
        }),
      });

      await loadFoods(userId);

      setExcludedSmartComboTitles((prev) => {
        const next = [combo.title, ...prev.filter((title) => title !== combo.title)];
        return next.slice(0, 2);
      });

      showSuccess(`${combo.title} added to log.`);
    } catch (error) {
      console.error("Error saving smart combo:", error);
      showError(error instanceof Error ? error.message : "Failed to add combo.");
    }
  };

  if (isAuthLoading) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#020409] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020409_0%,#04070d_35%,#020409_100%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(58,132,255,0.24),transparent_22%),radial-gradient(circle_at_84%_15%,rgba(44,110,255,0.20),transparent_18%),radial-gradient(circle_at_82%_62%,rgba(46,120,255,0.17),transparent_22%),radial-gradient(circle_at_18%_78%,rgba(53,103,255,0.17),transparent_24%)]" />
        <div className="absolute inset-y-0 left-[5%] w-[320px] bg-[#216dff]/[0.12] blur-[150px]" />
        <div className="absolute inset-y-0 right-[5%] w-[320px] bg-[#1d5fff]/[0.12] blur-[150px]" />
        <div className="absolute top-[150px] left-[9%] h-[320px] w-[320px] rounded-full bg-[#2b7dff]/[0.14] blur-[165px]" />
        <div className="absolute top-[220px] right-[8%] h-[320px] w-[320px] rounded-full bg-[#2a5fff]/[0.14] blur-[165px]" />
        <div className="absolute bottom-[100px] left-[25%] h-[260px] w-[260px] rounded-full bg-[#3a7fff]/[0.11] blur-[155px]" />
        <div className="absolute bottom-[110px] right-[20%] h-[260px] w-[260px] rounded-full bg-[#355dff]/[0.11] blur-[155px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
          <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.30em] text-[#6BC6FF]/85">
                LiftLog
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-zinc-400">
                Track your nutrition, daily progress, and body weight in one clean place.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="relative overflow-hidden rounded-[22px] border border-[#0B65B8] bg-[#04070d] px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.50)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(86,204,255,0.16),transparent_30%)]" />
                <p className="relative text-xs text-zinc-500">Calories</p>
                <p className="relative text-lg font-semibold">
                  <NeonMetricValue>{formatMacro(savedCalories)}</NeonMetricValue>
                </p>
                <p className="relative mt-1 text-xs text-zinc-500">
                  of {formatMacro(savedCalorieGoal)}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[22px] border border-[#0B65B8] bg-[#04070d] px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.50)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(86,204,255,0.16),transparent_30%)]" />
                <p className="relative text-xs text-zinc-500">Protein</p>
                <p className="relative text-lg font-semibold">
                  <NeonMetricValue>{formatMacro(savedProtein)}g</NeonMetricValue>
                </p>
                <p className="relative mt-1 text-xs text-zinc-500">
                  of {formatMacro(savedProteinGoal)}g
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[22px] border border-[#0B65B8] bg-[#04070d] px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.50)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(86,204,255,0.16),transparent_30%)]" />
                <p className="relative text-xs text-zinc-500">Weight</p>
                <p className="relative text-lg font-semibold">
                  <NeonMetricValue>{formatMacro(savedCurrentWeight)} lbs</NeonMetricValue>
                </p>
                <p className="relative mt-1 text-xs text-zinc-500">
                  goal {formatMacro(savedWeightGoal)}
                </p>
              </div>
            </div>
          </div>

          {messageText && (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-sm md:text-base ${
                messageType === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-300"
                  : "border-[#0B65B8] bg-[#07111d] text-[#b8e7ff]"
              }`}
            >
              {messageText}
            </div>
          )}

          {isDashboardLoading && (
            <div className="mb-6 rounded-2xl border border-[#0B65B8] bg-[#04070d] px-4 py-3 text-sm text-zinc-400 shadow-[0_20px_50px_rgba(0,0,0,0.48)]">
              Loading dashboard data...
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <DashboardPanel variant="primary">
                <div className="p-6 md:p-7">
                  <div className="mb-5">
                    <h2 className="text-xl font-semibold text-white md:text-2xl">
                      Day at a Glance
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      Live dashboard feedback based on today’s logs only.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#0B65B8] bg-[#060b12] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                      <p className="text-lg font-semibold text-white">
                        {progressTone.headline}
                      </p>
                      <p className="mt-2 text-sm text-zinc-400">
                        {progressTone.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div className="rounded-2xl border border-[#0B65B8] bg-[#080c14] p-4">
                        <p className="text-xs text-zinc-500">Meals Logged Today</p>
                        <p className="mt-1 text-xl font-semibold">{todayFoodLogs.length}</p>
                      </div>
                      <div className="rounded-2xl border border-[#0B65B8] bg-[#080c14] p-4">
                        <p className="text-xs text-zinc-500">Calories Left</p>
                        <p className="mt-1 text-xl font-semibold">
                          {formatMacro(caloriesRemaining)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#0B65B8] bg-[#080c14] p-4">
                        <p className="text-xs text-zinc-500">Protein Left</p>
                        <p className="mt-1 text-xl font-semibold">
                          {formatMacro(proteinRemaining)}g
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#0B65B8] bg-[#080c14] p-4">
                        <p className="text-xs text-zinc-500">Current Weight</p>
                        <p className="mt-1 text-xl font-semibold">
                          {formatMacro(savedCurrentWeight)} lbs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardPanel>

              <DashboardPanel variant="primary">
                <LogFoodCard
                  foodName={foodName}
                  setFoodName={setFoodName}
                  onFindFood={handleFindFood}
                />
              </DashboardPanel>

              <DashboardPanel variant="utility">
                <RecentFoodEntriesCard
                  recentEntries={recentEntries}
                  onEditFood={handleEditFood}
                  onDeleteFood={handleDeleteFood}
                  isDeletingFoodId={isDeletingFoodId}
                />
              </DashboardPanel>

              <DashboardPanel variant="utility">
                <FoodHistory historyDays={historyDays} />
              </DashboardPanel>

              <DashboardPanel variant="utility">
                <GoalsOverviewCard
                  savedCalorieGoal={round1(savedCalorieGoal)}
                  savedProteinGoal={round1(savedProteinGoal)}
                  savedCarbGoal={round1(savedCarbGoal)}
                  savedFatGoal={round1(savedFatGoal)}
                  savedWeightGoal={round1(savedWeightGoal)}
                />
              </DashboardPanel>

              <DashboardPanel variant="utility">
                <UpdateGoalsCard onOpen={() => setShowGoalsModal(true)} />
              </DashboardPanel>

              <DashboardPanel variant="utility">
                <WeightTrackingCard
                  savedCurrentWeight={round1(savedCurrentWeight)}
                  savedWeightGoal={round1(savedWeightGoal)}
                  onOpen={() => setShowWeightModal(true)}
                />
              </DashboardPanel>
            </div>

            <div className="space-y-6 lg:col-span-5">
              <DashboardPanel variant="primary">
                <TodaySummaryCard
                  recentEntriesCount={todayFoodLogs.length}
                  caloriesRemaining={caloriesRemaining}
                  proteinRemaining={proteinRemaining}
                  savedCurrentWeight={savedCurrentWeight}
                />
              </DashboardPanel>

              <DashboardPanel variant="primary">
                <SmartComboMealsCard
                  smartCombos={smartCombos}
                  onAddCombo={handleAddCombo}
                />
              </DashboardPanel>

              <DashboardPanel variant="primary">
                <DailyProgressCard
                  savedCalories={round1(savedCalories)}
                  savedCalorieGoal={round1(savedCalorieGoal)}
                  savedProtein={round1(savedProtein)}
                  savedProteinGoal={round1(savedProteinGoal)}
                  savedCarbs={round1(savedCarbs)}
                  savedCarbGoal={round1(savedCarbGoal)}
                  savedFats={round1(savedFats)}
                  savedFatGoal={round1(savedFatGoal)}
                  caloriesRemaining={caloriesRemaining}
                  proteinRemaining={proteinRemaining}
                  carbsRemaining={carbsRemaining}
                  fatsRemaining={fatsRemaining}
                />
              </DashboardPanel>

              <DashboardPanel variant="utility">
                <AccountCard />
              </DashboardPanel>
            </div>
          </div>
        </div>
      </div>

      <FoodModal
        showFoodModal={showFoodModal}
        modalMode={modalMode}
        suggestedFood={suggestedFood}
        foodName={foodName}
        setFoodName={setFoodName}
        calories={calories}
        setCalories={setCalories}
        protein={protein}
        setProtein={setProtein}
        carbs={carbs}
        setCarbs={setCarbs}
        fats={fats}
        setFats={setFats}
        onUseSuggestedFood={handleUseSuggestedFood}
        onLogMacros={handleLogMacros}
        onCancel={closeFoodModal}
        onEnterLabelMacros={() => setModalMode("manual")}
        isEditing={editingFoodId !== null}
      />

      <UpdateGoalsCard
        isModal
        isOpen={showGoalsModal}
        calorieGoal={calorieGoal}
        setCalorieGoal={setCalorieGoal}
        proteinGoal={proteinGoal}
        setProteinGoal={setProteinGoal}
        carbGoal={carbGoal}
        setCarbGoal={setCarbGoal}
        fatGoal={fatGoal}
        setFatGoal={setFatGoal}
        weightGoal={weightGoal}
        setWeightGoal={setWeightGoal}
        onSaveGoals={handleSaveGoals}
        onClose={() => {
          if (isOnboardingFlow) return;
          setShowGoalsModal(false);
        }}
      />

      <WeightTrackingCard
        isModal
        isOpen={showWeightModal}
        currentWeight={currentWeight}
        setCurrentWeight={setCurrentWeight}
        savedCurrentWeight={round1(savedCurrentWeight)}
        savedWeightGoal={round1(savedWeightGoal)}
        onUpdateWeight={handleUpdateWeight}
        onClose={() => {
          if (isOnboardingFlow) return;
          setShowWeightModal(false);
        }}
      />

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-[#0B65B8] bg-[#04070d] shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(82,170,255,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(56,120,255,0.10),transparent_30%)]" />

            <div className="relative border-b border-white/10 px-6 py-5">
              <h2 className="text-2xl font-semibold text-white">Delete Logged Meal</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Are you sure you want to remove{" "}
                <span className="font-medium text-white">“{foodToDeleteName}”</span>?
              </p>
            </div>

            <div className="relative px-6 py-6">
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                <p className="text-sm text-red-200">
                  This will immediately update your dashboard totals, progress bars,
                  and recent food entries.
                </p>
              </div>
            </div>

            <div className="relative flex flex-col-reverse gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                onClick={handleCancelDeleteFood}
                disabled={isConfirmDeleting}
                className="rounded-xl border border-[#1A5E98] bg-[#07111d] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0c1726] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDeleteFood}
                disabled={isConfirmDeleting}
                className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConfirmDeleting ? "Deleting..." : "Delete Meal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showWelcomeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 px-4">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-[#0B65B8] bg-[#04070d] shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(82,170,255,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(56,120,255,0.10),transparent_30%)]" />

            <div className="relative border-b border-white/10 px-6 py-6 md:px-8 md:py-7">
              <p className="text-sm uppercase tracking-[0.28em] text-[#73CCFF]/80">
                LiftLog
              </p>

              <div className="mt-4 max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                  Welcome to LiftLog
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-300 md:text-lg">
                  Your nutrition dashboard is ready. Let’s personalize it in under a
                  minute so your calories, macros, goal weight, and current weight are
                  all set from day one.
                </p>
              </div>
            </div>

            <div className="relative px-6 py-6 md:px-8 md:py-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[#0B65B8] bg-[#080c14] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Track Smarter
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    See calories and macros update instantly every time you log a meal.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#0B65B8] bg-[#080c14] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Stay on Target
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    Compare your daily intake against your calorie, macro, and weight goals.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#0B65B8] bg-[#080c14] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Eat with Direction
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    Get meal suggestions based on what your body still needs today.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#0B65B8] bg-[#080c14] px-5 py-4">
                <p className="text-sm text-zinc-300 md:text-base">
                  First, we’ll set your calorie target, macro goals, goal weight, and
                  current weight. After that, your dashboard will be fully personalized.
                </p>
              </div>
            </div>

            <div className="relative flex flex-col gap-3 border-t border-white/10 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <p className="text-sm text-zinc-500">Setup takes less than a minute.</p>

              <button
                onClick={handleStartOnboarding}
                className="rounded-2xl border border-[#61BEFF]/40 bg-[#4CB4FF] px-6 py-3 text-sm font-semibold text-[#03111d] shadow-[0_0_26px_rgba(76,180,255,0.28)] transition hover:bg-[#76CAFF]"
              >
                Set Up My Goals
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}