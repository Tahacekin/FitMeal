import { FitnessGoal, Meal, MealPlan, ShoppingItem, Ingredient, Macros } from './types';
import { calculateProteinNeed } from './utils';

// This would be replaced with actual AI API calls in production
export const generateMealPlan = async (
  fitnessGoal: FitnessGoal,
  weeklyBudget: number,
  userWeight: number = 75
): Promise<MealPlan> => {
  // In a real implementation, this would be an API call to an AI service
  console.log(`Generating meal plan for ${fitnessGoal} with budget ${weeklyBudget} TL`);
  
  // For now, return mock data based on the fitness goal and budget
  const dailyProteinNeed = calculateProteinNeed(fitnessGoal, userWeight);
  const weeklyProteinNeed = dailyProteinNeed * 7;
  
  // Generate mock meals
  const meals = generateMockMeals(fitnessGoal, weeklyBudget, weeklyProteinNeed);
  
  // Calculate totals
  const totalCost = meals.reduce((sum, meal) => sum + meal.cost, 0);
  
  const totalMacros = meals.reduce(
    (acc, meal) => {
      return {
        protein: acc.protein + meal.macros.protein,
        carbs: acc.carbs + meal.macros.carbs,
        fat: acc.fat + meal.macros.fat,
        calories: acc.calories + meal.macros.calories,
      };
    },
    { protein: 0, carbs: 0, fat: 0, calories: 0 }
  );
  
  // Generate shopping list
  const shoppingList = generateShoppingList(meals);
  
  return {
    meals,
    totalCost,
    totalMacros,
    shoppingList,
  };
};

// Helper function to generate mock meals
const generateMockMeals = (
  fitnessGoal: FitnessGoal,
  weeklyBudget: number,
  weeklyProteinNeed: number
): Meal[] => {
  const mealTemplates = getMealTemplatesByGoal(fitnessGoal);
  const meals: Meal[] = [];
  
  // Generate 14 meals (lunch & dinner for 7 days)
  for (let i = 0; i < 14; i++) {
    // Pick a random meal template
    const templateIndex = Math.floor(Math.random() * mealTemplates.length);
    const template = mealTemplates[templateIndex];
    
    // Adjust cost slightly for variety
    const costVariation = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    const adjustedCost = Math.round(template.cost * costVariation);
    
    // Ensure we're within budget
    if (meals.reduce((sum, meal) => sum + meal.cost, 0) + adjustedCost > weeklyBudget) {
      // If adding this meal would exceed the budget, choose a cheaper option
      const cheaperTemplate = mealTemplates
        .sort((a, b) => a.cost - b.cost)
        .find(t => t.cost + meals.reduce((sum, meal) => sum + meal.cost, 0) <= weeklyBudget);
      
      if (cheaperTemplate) {
        meals.push({
          ...cheaperTemplate,
          id: `meal-${i + 1}`,
        });
      }
      // If no meal fits the budget, skip
      continue;
    }
    
    meals.push({
      ...template,
      id: `meal-${i + 1}`,
      cost: adjustedCost,
    });
    
    // If we've added enough meals, break
    if (meals.length >= 14) break;
  }
  
  return meals;
};

// Helper function to generate shopping list
const generateShoppingList = (meals: Meal[]): ShoppingItem[] => {
  const ingredientMap = new Map<string, ShoppingItem>();
  
  meals.forEach(meal => {
    meal.ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase();
      
      if (ingredientMap.has(key)) {
        const existingItem = ingredientMap.get(key)!;
        // Add meal reference
        if (!existingItem.meals.includes(meal.name)) {
          existingItem.meals.push(meal.name);
        }
        // Add cost
        existingItem.cost += ingredient.cost;
      } else {
        ingredientMap.set(key, {
          ...ingredient,
          meals: [meal.name],
        });
      }
    });
  });
  
  return Array.from(ingredientMap.values());
};

// Mock meal templates based on fitness goal
const getMealTemplatesByGoal = (fitnessGoal: FitnessGoal): Meal[] => {
  switch (fitnessGoal) {
    case 'fit':
      return [
        {
          id: 'chicken-salad',
          name: 'Grilled Chicken Salad',
          ingredients: [
            { name: 'Chicken Breast', quantity: '200g', cost: 35 },
            { name: 'Mixed Greens', quantity: '100g', cost: 12 },
            { name: 'Cherry Tomatoes', quantity: '50g', cost: 8 },
            { name: 'Olive Oil', quantity: '15ml', cost: 5 },
            { name: 'Lemon', quantity: '1', cost: 3 },
          ],
          macros: { protein: 40, carbs: 10, fat: 15, calories: 330 },
          cost: 63,
          instructions: [
            'Season chicken breast with salt and pepper',
            'Grill for 6-8 minutes per side until cooked through',
            'Slice chicken and mix with greens, tomatoes',
            'Drizzle with olive oil and squeeze lemon juice'
          ],
        },
        {
          id: 'tuna-wrap',
          name: 'Tuna Protein Wrap',
          ingredients: [
            { name: 'Canned Tuna', quantity: '150g', cost: 25 },
            { name: 'Whole Wheat Tortilla', quantity: '1', cost: 5 },
            { name: 'Greek Yogurt', quantity: '50g', cost: 7 },
            { name: 'Cucumber', quantity: '50g', cost: 3 },
            { name: 'Red Onion', quantity: '30g', cost: 2 },
          ],
          macros: { protein: 35, carbs: 25, fat: 8, calories: 310 },
          cost: 42,
          instructions: [
            'Mix tuna with Greek yogurt',
            'Dice cucumber and red onion',
            'Spread tuna mixture on tortilla',
            'Add vegetables and roll up tightly'
          ],
        },
        {
          id: 'lentil-soup',
          name: 'Turkish Red Lentil Soup',
          ingredients: [
            { name: 'Red Lentils', quantity: '100g', cost: 10 },
            { name: 'Onion', quantity: '1', cost: 3 },
            { name: 'Carrot', quantity: '1', cost: 2 },
            { name: 'Tomato Paste', quantity: '15g', cost: 4 },
            { name: 'Cumin', quantity: '5g', cost: 2 },
          ],
          macros: { protein: 20, carbs: 40, fat: 3, calories: 270 },
          cost: 21,
          instructions: [
            'Sauté diced onion and carrot until soft',
            'Add tomato paste and cumin, stir for 1 minute',
            'Add lentils and 750ml water',
            'Simmer for 20-25 minutes until lentils are soft',
            'Blend until smooth and serve hot'
          ],
        },
        {
          id: 'egg-veg-bowl',
          name: 'Vegetable Egg Bowl',
          ingredients: [
            { name: 'Eggs', quantity: '3', cost: 15 },
            { name: 'Spinach', quantity: '100g', cost: 12 },
            { name: 'Bell Pepper', quantity: '1', cost: 5 },
            { name: 'Olive Oil', quantity: '10ml', cost: 3 },
            { name: 'Feta Cheese', quantity: '30g', cost: 10 },
          ],
          macros: { protein: 25, carbs: 8, fat: 20, calories: 310 },
          cost: 45,
          instructions: [
            'Sauté spinach and bell pepper in olive oil',
            'Scramble eggs and add to vegetables',
            'Cook until eggs are set',
            'Top with crumbled feta cheese'
          ],
        },
      ];
    case 'bulk':
      return [
        {
          id: 'beef-rice-bowl',
          name: 'Beef and Rice Power Bowl',
          ingredients: [
            { name: 'Lean Ground Beef', quantity: '250g', cost: 65 },
            { name: 'Brown Rice', quantity: '150g', cost: 8 },
            { name: 'Bell Pepper', quantity: '1', cost: 5 },
            { name: 'Onion', quantity: '1', cost: 3 },
            { name: 'Olive Oil', quantity: '15ml', cost: 5 },
          ],
          macros: { protein: 45, carbs: 60, fat: 25, calories: 650 },
          cost: 86,
          instructions: [
            'Cook brown rice according to package instructions',
            'Brown ground beef in a pan with olive oil',
            'Add diced onion and bell pepper, sauté until soft',
            'Season with salt, pepper, and your favorite spices',
            'Serve beef mixture over brown rice'
          ],
        },
        {
          id: 'protein-oatmeal',
          name: 'High-Protein Oatmeal',
          ingredients: [
            { name: 'Oats', quantity: '100g', cost: 7 },
            { name: 'Protein Powder', quantity: '30g', cost: 20 },
            { name: 'Banana', quantity: '1', cost: 4 },
            { name: 'Peanut Butter', quantity: '30g', cost: 8 },
            { name: 'Milk', quantity: '250ml', cost: 5 },
          ],
          macros: { protein: 35, carbs: 70, fat: 15, calories: 550 },
          cost: 44,
          instructions: [
            'Cook oats with milk according to package instructions',
            'Stir in protein powder once oats are cooked',
            'Top with sliced banana and peanut butter',
            'Add honey or cinnamon if desired'
          ],
        },
        {
          id: 'chicken-pasta',
          name: 'Chicken Pasta with Yogurt Sauce',
          ingredients: [
            { name: 'Chicken Breast', quantity: '250g', cost: 45 },
            { name: 'Whole Wheat Pasta', quantity: '150g', cost: 10 },
            { name: 'Greek Yogurt', quantity: '100g', cost: 12 },
            { name: 'Garlic', quantity: '2 cloves', cost: 2 },
            { name: 'Olive Oil', quantity: '15ml', cost: 5 },
          ],
          macros: { protein: 50, carbs: 65, fat: 15, calories: 600 },
          cost: 74,
          instructions: [
            'Cook pasta according to package instructions',
            'Season and cook chicken breast in olive oil',
            'Mix Greek yogurt with minced garlic and salt',
            'Slice cooked chicken and toss with pasta',
            'Add yogurt sauce and mix well'
          ],
        },
        {
          id: 'turkish-kofte',
          name: 'Turkish Köfte with Bulgur',
          ingredients: [
            { name: 'Ground Lamb/Beef Mix', quantity: '250g', cost: 60 },
            { name: 'Bulgur', quantity: '150g', cost: 8 },
            { name: 'Onion', quantity: '1', cost: 3 },
            { name: 'Parsley', quantity: '30g', cost: 5 },
            { name: 'Tomato Paste', quantity: '30g', cost: 6 },
          ],
          macros: { protein: 48, carbs: 55, fat: 30, calories: 680 },
          cost: 82,
          instructions: [
            'Mix ground meat with grated onion, chopped parsley, and spices',
            'Form into small oval patties',
            'Grill or pan-fry köfte until cooked through',
            'Cook bulgur with tomato paste and water',
            'Serve köfte over bulgur pilaf'
          ],
        },
      ];
    case 'healthy':
    default:
      return [
        {
          id: 'mediterranean-bowl',
          name: 'Mediterranean Quinoa Bowl',
          ingredients: [
            { name: 'Quinoa', quantity: '100g', cost: 15 },
            { name: 'Chickpeas', quantity: '150g', cost: 8 },
            { name: 'Cucumber', quantity: '1', cost: 5 },
            { name: 'Cherry Tomatoes', quantity: '100g', cost: 12 },
            { name: 'Olive Oil', quantity: '15ml', cost: 5 },
          ],
          macros: { protein: 18, carbs: 45, fat: 12, calories: 360 },
          cost: 45,
          instructions: [
            'Cook quinoa according to package instructions',
            'Rinse and drain chickpeas',
            'Dice cucumber and halve cherry tomatoes',
            'Combine all ingredients in a bowl',
            'Drizzle with olive oil and lemon juice, season with herbs'
          ],
        },
        {
          id: 'fish-veg',
          name: 'Baked Fish with Seasonal Vegetables',
          ingredients: [
            { name: 'White Fish Fillet', quantity: '200g', cost: 40 },
            { name: 'Zucchini', quantity: '1', cost: 6 },
            { name: 'Carrot', quantity: '1', cost: 2 },
            { name: 'Lemon', quantity: '1', cost: 3 },
            { name: 'Olive Oil', quantity: '15ml', cost: 5 },
          ],
          macros: { protein: 35, carbs: 15, fat: 10, calories: 290 },
          cost: 56,
          instructions: [
            'Preheat oven to 200°C',
            'Place fish fillet in the center of parchment paper',
            'Surround with sliced zucchini and carrot',
            'Drizzle with olive oil and add lemon slices',
            'Wrap parchment and bake for 15-20 minutes'
          ],
        },
        {
          id: 'lentil-salad',
          name: 'Green Lentil and Vegetable Salad',
          ingredients: [
            { name: 'Green Lentils', quantity: '100g', cost: 10 },
            { name: 'Bell Pepper', quantity: '1', cost: 5 },
            { name: 'Red Onion', quantity: '1/2', cost: 2 },
            { name: 'Parsley', quantity: '30g', cost: 5 },
            { name: 'Lemon', quantity: '1', cost: 3 },
          ],
          macros: { protein: 15, carbs: 35, fat: 5, calories: 245 },
          cost: 25,
          instructions: [
            'Cook lentils until tender but not mushy',
            'Dice bell pepper and red onion',
            'Chop parsley finely',
            'Combine all ingredients in a bowl',
            'Dress with lemon juice, olive oil, salt and pepper'
          ],
        },
        {
          id: 'yogurt-fruit-bowl',
          name: 'Greek Yogurt and Fresh Fruit Bowl',
          ingredients: [
            { name: 'Greek Yogurt', quantity: '200g', cost: 20 },
            { name: 'Mixed Berries', quantity: '100g', cost: 20 },
            { name: 'Banana', quantity: '1', cost: 4 },
            { name: 'Honey', quantity: '15g', cost: 5 },
            { name: 'Walnuts', quantity: '30g', cost: 10 },
          ],
          macros: { protein: 20, carbs: 45, fat: 12, calories: 365 },
          cost: 59,
          instructions: [
            'Add Greek yogurt to a bowl',
            'Top with mixed berries and sliced banana',
            'Drizzle with honey',
            'Sprinkle chopped walnuts on top'
          ],
        },
      ];
  }
};