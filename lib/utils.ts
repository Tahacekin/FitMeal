import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateProteinNeed = (goal: string, weight: number = 75): number => {
  switch (goal) {
    case 'fit':
      return weight * 1.5;
    case 'bulk':
      return weight * 2;
    case 'healthy':
    default:
      return weight * 1.2;
  }
};

export const calculateTotalCost = (items: { cost: number }[]): number => {
  return items.reduce((total, item) => total + item.cost, 0);
};