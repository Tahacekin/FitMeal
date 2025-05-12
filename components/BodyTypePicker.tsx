'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Salad, Beef } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FitnessGoal } from '@/lib/types';
import useStore from '@/store/useStore';

const BodyTypePicker = () => {
  const { fitnessGoal, setFitnessGoal } = useStore();
  
  const handleSelect = (goal: FitnessGoal) => {
    setFitnessGoal(goal);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-8">Choose Your Fitness Goal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GoalCard 
          title="Fit" 
          description="Lean, toned body with moderate muscle definition"
          icon={<Dumbbell className="h-12 w-12" />}
          color="bg-blue-50 border-blue-200 hover:border-blue-400"
          activeColor="border-blue-500 bg-blue-100"
          textColor="text-blue-700"
          isSelected={fitnessGoal === 'fit'}
          onClick={() => handleSelect('fit')}
        />
        
        <GoalCard 
          title="Bulk" 
          description="Gain muscle mass and strength"
          icon={<Beef className="h-12 w-12" />}
          color="bg-orange-50 border-orange-200 hover:border-orange-400"
          activeColor="border-orange-500 bg-orange-100"
          textColor="text-orange-700"
          isSelected={fitnessGoal === 'bulk'}
          onClick={() => handleSelect('bulk')}
        />
        
        <GoalCard 
          title="Healthy" 
          description="Balanced nutrition with focus on overall health"
          icon={<Salad className="h-12 w-12" />}
          color="bg-green-50 border-green-200 hover:border-green-400"
          activeColor="border-green-500 bg-green-100"
          textColor="text-green-700"
          isSelected={fitnessGoal === 'healthy'}
          onClick={() => handleSelect('healthy')}
        />
      </div>
    </div>
  );
};

interface GoalCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  activeColor: string;
  textColor: string;
  isSelected: boolean;
  onClick: () => void;
}

const GoalCard = ({
  title,
  description,
  icon,
  color,
  activeColor,
  textColor,
  isSelected,
  onClick,
}: GoalCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer",
        color,
        isSelected ? activeColor : "",
      )}
      onClick={onClick}
    >
      {isSelected && (
        <motion.div
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </motion.div>
      )}
      
      <div className={cn("mb-4", textColor)}>{icon}</div>
      
      <h3 className={cn("text-xl font-semibold mb-2", textColor)}>{title}</h3>
      
      <p className="text-gray-600 text-center text-sm">{description}</p>
    </motion.div>
  );
};

export default BodyTypePicker;