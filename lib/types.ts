export type FitnessGoal = 'fit' | 'bulk' | 'healthy';

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface Ingredient {
  name: string;
  quantity: string;
  cost: number;
}

export interface Meal {
  id: string;
  name: string;
  ingredients: Ingredient[];
  macros: Macros;
  cost: number;
  instructions: string[];
}

export interface ShoppingItem extends Ingredient {
  meals: string[];
}

export interface MealPlan {
  meals: Meal[];
  totalCost: number;
  totalMacros: Macros;
  shoppingList: ShoppingItem[];
}

export interface AppState {
  fitnessGoal: FitnessGoal | null;
  weeklyBudget: number | null;
  userWeight: number;
  mealPlan: MealPlan | null;
  isLoading: boolean;
  setFitnessGoal: (goal: FitnessGoal) => void;
  setWeeklyBudget: (budget: number) => void;
  setUserWeight: (weight: number) => void;
  generateMealPlan: () => Promise<void>;
  resetMealPlan: () => void;
}