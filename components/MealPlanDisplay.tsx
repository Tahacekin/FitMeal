'use client';

import { motion } from 'framer-motion';
import { Clock, ChefHat, DollarSign, Salad, Beef, Fish } from 'lucide-react';
import useStore from '@/store/useStore';
import { formatCurrency } from '@/lib/utils';
import { Meal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const MealPlanDisplay = () => {
  const { mealPlan, fitnessGoal, weeklyBudget, generateMealPlan, isLoading } = useStore();

  if (!mealPlan) {
    return null;
  }

  // Group meals by day (assuming 2 meals per day)
  const mealsByDay = mealPlan.meals.reduce<Record<number, Meal[]>>((acc, meal, index) => {
    const day = Math.floor(index / 2) + 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(meal);
    return acc;
  }, {});

  // Calculate weekly budget usage
  const budgetUsagePercentage = (mealPlan.totalCost / (weeklyBudget || 1)) * 100;

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Your Meal Plan</h2>
            <p className="text-muted-foreground">Based on your {fitnessGoal} goal</p>
          </div>
          <Button
            onClick={() => generateMealPlan()}
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            {isLoading ? 'Generating...' : 'Generate New Plan'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <Salad className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Protein</p>
              <p className="font-semibold">{mealPlan.totalMacros.protein.toFixed(0)}g</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <DollarSign className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="font-semibold">{formatCurrency(mealPlan.totalCost)}</p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 flex items-center">
            <div className="p-2 bg-orange-100 rounded-full mr-3">
              <ChefHat className="h-5 w-5 text-orange-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Meals</p>
              <p className="font-semibold">{mealPlan.meals.length} meals</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Budget Usage</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(mealPlan.totalCost)} of {formatCurrency(weeklyBudget || 0)}
            </span>
          </div>
          <Progress value={budgetUsagePercentage} 
            className={`h-2 ${budgetUsagePercentage > 90 ? 'bg-red-100' : 'bg-gray-100'}`} 
          />
        </div>
      </div>

      <Tabs defaultValue="1" className="w-full">
        <div className="px-6 pt-4 border-b border-gray-100">
          <TabsList className="w-full justify-start overflow-x-auto py-1 h-auto bg-transparent">
            {Object.keys(mealsByDay).map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
              >
                Day {day}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.entries(mealsByDay).map(([day, dailyMeals]) => (
          <TabsContent key={day} value={day} className="p-0 m-0">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dailyMeals.map((meal, index) => (
                  <MealCard key={meal.id} meal={meal} mealIndex={index} />
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
};

interface MealCardProps {
  meal: Meal;
  mealIndex: number;
}

const MealCard = ({ meal, mealIndex }: MealCardProps) => {
  const mealType = mealIndex % 2 === 0 ? 'Lunch' : 'Dinner';
  
  // Choose icon based on meal content
  const getMealIcon = () => {
    const mealNameLower = meal.name.toLowerCase();
    if (mealNameLower.includes('chicken') || mealNameLower.includes('beef') || mealNameLower.includes('meat')) {
      return <Beef className="h-5 w-5" />;
    } else if (mealNameLower.includes('fish') || mealNameLower.includes('tuna')) {
      return <Fish className="h-5 w-5" />;
    } else {
      return <Salad className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * mealIndex }}
    >
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-1.5 bg-gray-200 rounded-full mr-3">
            {getMealIcon()}
          </div>
          <div>
            <p className="text-sm text-gray-500">{mealType}</p>
            <h3 className="font-semibold">{meal.name}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Cost</p>
          <p className="font-medium text-green-700">{formatCurrency(meal.cost)}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Macronutrients</h4>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="bg-blue-50 p-2 rounded text-center">
              <p className="text-xs text-gray-500">Protein</p>
              <p className="font-medium">{meal.macros.protein}g</p>
            </div>
            <div className="bg-amber-50 p-2 rounded text-center">
              <p className="text-xs text-gray-500">Carbs</p>
              <p className="font-medium">{meal.macros.carbs}g</p>
            </div>
            <div className="bg-red-50 p-2 rounded text-center">
              <p className="text-xs text-gray-500">Fat</p>
              <p className="font-medium">{meal.macros.fat}g</p>
            </div>
            <div className="bg-purple-50 p-2 rounded text-center">
              <p className="text-xs text-gray-500">Calories</p>
              <p className="font-medium">{meal.macros.calories}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients</h4>
          <ul className="space-y-1 text-sm">
            {meal.ingredients.map((ingredient, i) => (
              <li key={i} className="flex justify-between">
                <span>{ingredient.name}</span>
                <span className="text-gray-500">{ingredient.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-4" />

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Instructions</h4>
          <ol className="space-y-1 text-sm list-decimal list-inside">
            {meal.instructions.map((step, i) => (
              <li key={i} className="text-gray-600">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </motion.div>
  );
};

export default MealPlanDisplay;