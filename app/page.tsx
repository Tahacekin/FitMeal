'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Utensils } from 'lucide-react';
import useStore from '@/store/useStore';
import BodyTypePicker from '@/components/BodyTypePicker';
import BudgetInput from '@/components/BudgetInput';
import MealPlanDisplay from '@/components/MealPlanDisplay';
import ShoppingList from '@/components/ShoppingList';
import ProteinCalculator from '@/components/ProteinCalculator';
import WeightInput from '@/components/WeightInput';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const { fitnessGoal, weeklyBudget, mealPlan, generateMealPlan, isLoading } = useStore();
  const [showGenerateButton, setShowGenerateButton] = useState(false);

  // Check if the user has selected both a fitness goal and budget
  useEffect(() => {
    if (fitnessGoal && weeklyBudget && !mealPlan && !isLoading) {
      setShowGenerateButton(true);
    } else {
      setShowGenerateButton(false);
    }
  }, [fitnessGoal, weeklyBudget, mealPlan, isLoading]);

  return (
    <main className="min-h-screen bg-gray-50">
      <motion.header 
        className="bg-white border-b border-gray-200 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">FitMeal</h1>
              <div className="ml-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                AI Powered
              </div>
            </div>
          </div>
        </div>
      </motion.header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {!mealPlan ? (
          <section className="space-y-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Plan Your Fitness Meals
              </h1>
              <p className="text-xl text-gray-600">
                Create a personalized meal plan based on your fitness goals and budget
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
            >
              <div className="space-y-10">
                <BodyTypePicker />
                
                {fitnessGoal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Separator className="my-8" />
                    <WeightInput />
                  </motion.div>
                )}
                
                {fitnessGoal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Separator className="my-8" />
                    <BudgetInput />
                  </motion.div>
                )}
                
                {showGenerateButton && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center pt-4"
                  >
                    <Button
                      size="lg"
                      onClick={generateMealPlan}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Dumbbell className="h-5 w-5" />
                      {isLoading ? 'Generating Plan...' : 'Generate Meal Plan'}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Using AI to create your personalized plan
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </section>
        ) : (
          <section>
            <Tabs defaultValue="meal-plan" className="space-y-8">
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                <TabsList className="w-full justify-start p-0 h-14 bg-transparent border-b border-gray-200 rounded-none">
                  <TabsTrigger 
                    value="meal-plan"
                    className="flex-1 h-full data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none"
                  >
                    Meal Plan
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="shopping-list"
                    className="flex-1 h-full data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none"
                  >
                    Shopping List
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="nutrition"
                    className="flex-1 h-full data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none"
                  >
                    Nutrition
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="meal-plan" className="mt-6">
                <MealPlanDisplay />
              </TabsContent>
              
              <TabsContent value="shopping-list" className="mt-6">
                <ShoppingList />
              </TabsContent>
              
              <TabsContent value="nutrition" className="mt-6">
                <ProteinCalculator />
              </TabsContent>
            </Tabs>
          </section>
        )}
      </div>
    </main>
  );
}