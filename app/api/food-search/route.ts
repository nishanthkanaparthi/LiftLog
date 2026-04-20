import { NextRequest, NextResponse } from "next/server";

type USDANutrient = {
  nutrientName?: string;
  unitName?: string;
  value?: number;
};

type USDAFood = {
  description?: string;
  brandOwner?: string;
  dataType?: string;
  foodNutrients?: USDANutrient[];
};

type USDAFoodsSearchResponse = {
  foods?: USDAFood[];
};

type AppFoodResult = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s]/g, "");
}

function singularizeWord(word: string) {
  if (word.endsWith("ies") && word.length > 3) {
    return word.slice(0, -3) + "y";
  }

  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 2) {
    return word.slice(0, -1);
  }

  return word;
}

function normalizeWords(text: string) {
  return normalizeText(text)
    .split(" ")
    .filter(Boolean)
    .map(singularizeWord);
}

function normalizeForComparison(text: string) {
  return normalizeWords(text).join(" ");
}

function cleanDisplayName(food: USDAFood) {
  const description = food.description?.trim() ?? "";
  const brandOwner = food.brandOwner?.trim() ?? "";
  const dataType = food.dataType?.trim() ?? "";

  let name = description.replace(/\s+/g, " ").trim();

  name = name.replace(/\s*,\s*/g, ", ");
  name = name.replace(/\s*-\s*/g, " - ");

  if (
    brandOwner &&
    dataType === "Branded" &&
    !name.toLowerCase().includes(brandOwner.toLowerCase())
  ) {
    name = `${name} - ${brandOwner}`;
  }

  return name;
}

function getNutrientValue(
  nutrients: USDANutrient[] | undefined,
  options: {
    exactNames?: string[];
    includes?: string[];
    preferredUnit?: string;
  }
) {
  if (!nutrients || nutrients.length === 0) {
    return 0;
  }

  const { exactNames = [], includes = [], preferredUnit } = options;

  const exactMatch = nutrients.find((nutrient) => {
    const name = nutrient.nutrientName?.trim();
    const unit = nutrient.unitName?.trim().toUpperCase();

    if (!name) return false;
    if (!exactNames.includes(name)) return false;
    if (preferredUnit && unit !== preferredUnit.toUpperCase()) return false;

    return typeof nutrient.value === "number";
  });

  if (exactMatch && typeof exactMatch.value === "number") {
    return exactMatch.value;
  }

  const includesMatch = nutrients.find((nutrient) => {
    const name = nutrient.nutrientName?.toLowerCase().trim() ?? "";
    const unit = nutrient.unitName?.trim().toUpperCase();

    if (!name) return false;
    if (!includes.some((term) => name.includes(term.toLowerCase()))) return false;
    if (preferredUnit && unit !== preferredUnit.toUpperCase()) return false;

    return typeof nutrient.value === "number";
  });

  if (includesMatch && typeof includesMatch.value === "number") {
    return includesMatch.value;
  }

  return 0;
}

function mapUSDAFoodToAppFood(food: USDAFood): AppFoodResult | null {
  const description = food.description?.trim();
  if (!description) {
    return null;
  }

  const nutrients = food.foodNutrients ?? [];

  const calories = getNutrientValue(nutrients, {
    exactNames: ["Energy"],
    preferredUnit: "KCAL",
  });

  const protein = getNutrientValue(nutrients, {
    exactNames: ["Protein"],
  });

  const carbs = getNutrientValue(nutrients, {
    exactNames: ["Carbohydrate, by difference"],
    includes: ["carbohydrate"],
  });

  const fats = getNutrientValue(nutrients, {
    exactNames: ["Total lipid (fat)"],
    includes: ["total lipid", "fat"],
  });

  return {
    name: cleanDisplayName(food),
    calories: Math.round(calories),
    protein: Number(protein.toFixed(1)),
    carbs: Number(carbs.toFixed(1)),
    fats: Number(fats.toFixed(1)),
  };
}

function getDataTypeBonus(dataType: string | undefined) {
  switch ((dataType ?? "").toLowerCase()) {
    case "foundation":
      return 90;
    case "sr legacy":
      return 80;
    case "survey (fndds)":
      return 60;
    case "branded":
      return 35;
    default:
      return 0;
  }
}

function getNamePenalty(name: string) {
  const lower = name.toLowerCase();

  let penalty = 0;

  const noisyTerms = [
    "chips",
    "split",
    "baked",
    "frozen",
    "dried",
    "candied",
    "dessert",
    "pudding",
    "pie",
    "baby food",
  ];

  for (const term of noisyTerms) {
    if (lower.includes(term)) {
      penalty += 80;
    }
  }

  return penalty;
}

function scoreFoodMatch(query: string, food: USDAFood, mappedFood: AppFoodResult) {
  const rawName = mappedFood.name;
  const normalizedQuery = normalizeForComparison(query);
  const normalizedName = normalizeForComparison(rawName);

  let score = 0;

  if (normalizedName === normalizedQuery) score += 1500;
  if (normalizedName.startsWith(normalizedQuery + " ")) score += 700;
  if (normalizedName.includes(normalizedQuery)) score += 300;

  const queryWords = normalizeWords(query);
  const nameWords = normalizeWords(rawName);

  for (const word of queryWords) {
    if (nameWords.includes(word)) {
      score += 90;
    } else if (normalizedName.includes(word)) {
      score += 35;
    }
  }

  score += getDataTypeBonus(food.dataType);
  score -= getNamePenalty(rawName);
  score -= Math.max(normalizedName.length - normalizedQuery.length, 0) * 1.2;

  if (normalizedName.includes("raw")) score += 80;
  if (normalizedName.includes("cooked")) score += 20;

  return score;
}

function dedupeFoods(foods: AppFoodResult[]) {
  const seen = new Set<string>();
  const result: AppFoodResult[] = [];

  for (const food of foods) {
    const key = normalizeForComparison(food.name);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(food);
    }
  }

  return result;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json(
      { error: "Missing food search query." },
      { status: 400 }
    );
  }

  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "USDA_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const usdaResponse = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          pageSize: 20,
        }),
        cache: "no-store",
      }
    );

    if (!usdaResponse.ok) {
      const errorText = await usdaResponse.text();
      console.error("USDA search error:", errorText);

      return NextResponse.json(
        { error: "Failed to search USDA food database." },
        { status: 502 }
      );
    }

    const data: USDAFoodsSearchResponse = await usdaResponse.json();

    const mappedFoods: AppFoodResult[] = (data.foods ?? [])
      .map((food) => {
        const mapped = mapUSDAFoodToAppFood(food);
        if (!mapped) return null;

        return {
          mapped,
          score: scoreFoodMatch(query, food, mapped),
        };
      })
      .filter(
        (
          item
        ): item is {
          mapped: AppFoodResult;
          score: number;
        } => item !== null
      )
      .filter(
        (item) =>
          item.mapped.name.trim() !== "" &&
          (item.mapped.calories > 0 ||
            item.mapped.protein > 0 ||
            item.mapped.carbs > 0 ||
            item.mapped.fats > 0)
      )
      .sort((a, b) => b.score - a.score)
      .map((item) => item.mapped);

    const foods = dedupeFoods(mappedFoods).slice(0, 5);

    return NextResponse.json({ foods });
  } catch (error) {
    console.error("GET /api/food-search error:", error);

    return NextResponse.json(
      { error: "Unexpected error while searching foods." },
      { status: 500 }
    );
  }
}