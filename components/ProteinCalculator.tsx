'use client';

import { motion } from 'framer-motion';
import { Activity, Info } from 'lucide-react';
import { calculateProteinNeed } from '@/lib/utils';
import useStore from '@/store/useStore';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ProteinCalculator = () => {
  const { fitnessGoal, userWeight, mealPlan } = useStore();

  if (!fitnessGoal) return null;

  const dailyProteinNeed = calculateProteinNeed(fitnessGoal, userWeight);
  const weeklyProteinNeed = dailyProteinNeed * 7;
  
  // Calculate plan protein if meal plan exists
  const planProtein = mealPlan ? mealPlan.totalMacros.protein : 0;
  const proteinPercentage = (planProtein / weeklyProteinNeed) * 100;

  const getProteinRateDescription = () => {
    switch (fitnessGoal) {
      case 'fit':
        return '1.5g protein / kg body weight';
      case 'bulk':
        return '2g protein / kg body weight';
      case 'healthy':
        return '1.2g protein / kg body weight';
      default:
        return '';
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center">
        <Activity className="h-5 w-5 mr-3 text-blue-600" />
        <h3 className="font-semibold">Protein Calculator</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-2">
                <Info className="h-4 w-4 text-gray-400" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="w-80">
              <p>
                Protein needs are calculated based on your fitness goal:
                <br />
                - Fit: 1.5g protein / kg body weight
                <br />
                - Bulk: 2g protein / kg body weight
                <br />
                - Healthy: 1.2g protein / kg body weight
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Your protein rate:</span>
            <span className="font-medium">{getProteinRateDescription()}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Daily protein target:</span>
            <span className="font-medium">{dailyProteinNeed.toFixed(0)}g</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Weekly protein target:</span>
            <span className="font-medium">{weeklyProteinNeed.toFixed(0)}g</span>
          </div>
        </div>
        
        {mealPlan && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Plan protein content:</span>
              <span className="font-medium">{planProtein.toFixed(0)}g</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Meets {proteinPercentage.toFixed(0)}% of your weekly needs</span>
                <span>{planProtein.toFixed(0)}g / {weeklyProteinNeed.toFixed(0)}g</span>
              </div>
              <Progress 
                value={Math.min(proteinPercentage, 100)} 
                className={`h-2 ${
                  proteinPercentage < 80 
                    ? 'bg-red-100' 
                    : proteinPercentage < 100 
                      ? 'bg-yellow-100' 
                      : 'bg-green-100'
                }`}
              />
            </div>
            
            <div className="pt-2 mt-2 border-t border-gray-100 text-sm">
              <div className="text-gray-600">
                {proteinPercentage < 80 && (
                  <p className="text-red-600">
                    Your meal plan is low in protein. Consider adding more protein-rich foods.
                  </p>
                )}
                {proteinPercentage >= 80 && proteinPercentage < 100 && (
                  <p className="text-yellow-600">
                    Your meal plan is close to meeting your protein needs.
                  </p>
                )}
                {proteinPercentage >= 100 && (
                  <p className="text-green-600">
                    Your meal plan meets or exceeds your protein needs!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProteinCalculator;