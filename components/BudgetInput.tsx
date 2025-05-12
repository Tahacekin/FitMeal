'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Fish as TurkishLira, AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import useStore from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const BudgetInput = () => {
  const { weeklyBudget, setWeeklyBudget } = useStore();
  const [inputValue, setInputValue] = useState(weeklyBudget?.toString() || '');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budget = Number(inputValue);
    
    if (isNaN(budget) || budget <= 0) {
      setError('Please enter a valid positive number');
      return;
    }
    
    setWeeklyBudget(budget);
    setError(null);
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Set Your Weekly Budget</h2>
          <p className="text-muted-foreground">How much would you like to spend on groceries this week?</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Weekly Budget (TL)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TurkishLira className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="budget"
                type="number"
                placeholder="Enter your budget in Turkish Liras"
                value={inputValue}
                onChange={handleChange}
                className={cn(
                  "pl-10",
                  error ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
                min="0"
                step="any"
              />
            </div>
            
            {error && (
              <motion.div 
                className="flex items-center text-red-500 text-sm mt-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </motion.div>
            )}
          </div>
          
          <Button 
            type="submit"
            className="w-full"
          >
            Set Budget
          </Button>
        </form>
        
        {weeklyBudget && (
          <motion.div 
            className="text-center px-4 py-3 rounded-lg bg-green-50 border border-green-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-green-800">
              Your weekly budget is set to <span className="font-bold">{formatCurrency(weeklyBudget)}</span>
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BudgetInput;