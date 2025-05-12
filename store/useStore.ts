'use client';

import { create } from 'zustand';
import { generateMealPlan as generateAIMealPlan } from '@/lib/mealPlanningService';
import { AppState, FitnessGoal } from '@/lib/types';

const useStore = create<AppState>((set, get) => ({
  fitnessGoal: null,
  weeklyBudget: null,
  userWeight: 75, // Default weight in kg
  mealPlan: null,
  isLoading: false,

  setFitnessGoal: (goal: FitnessGoal) => {
    set({ fitnessGoal: goal });
  },

  setWeeklyBudget: (budget: number) => {
    set({ weeklyBudget: budget });
  },

  setUserWeight: (weight: number) => {
    set({ userWeight: weight });
  },

  generateMealPlan: async () => {
    const { fitnessGoal, weeklyBudget, userWeight } = get();
    
    if (!fitnessGoal || !weeklyBudget) {
      return;
    }

    set({ isLoading: true });

    try {
      const mealPlan = await generateAIMealPlan(fitnessGoal, weeklyBudget, userWeight);
      set({ mealPlan });
    } catch (error) {
      console.error('Failed to generate meal plan:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  resetMealPlan: () => {
    set({ mealPlan: null });
  },
}));

export default useStore;