export type FoodItem = {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  
  export type LoggedFood = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    createdAt: string;
  };
  
  export type BaseComboMeal = {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  
  export type SmartComboMeal = {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    reason: string;
    tag: string;
    score: number;
  };
  
  export type DayReview = {
    headline: string;
    status: string;
    bullets: string[];
    focus: string;
  };
  
  export type MessageType = "success" | "error" | "";