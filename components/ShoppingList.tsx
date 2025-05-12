'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, X, DollarSign, ArrowDownToLine, Check, ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import useStore from '@/store/useStore';
import type { ShoppingItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const ShoppingList = () => {
  const { mealPlan } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!mealPlan) {
    return null;
  }

  const { shoppingList } = mealPlan;

  // Filter items by search term
  const filteredItems = searchTerm
    ? shoppingList.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meals.some(meal => meal.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : shoppingList;

  // Calculate total cost of all items
  const totalCost = filteredItems.reduce((sum, item) => sum + item.cost, 0);
  
  // Calculate total cost of checked items
  const checkedItemsCost = filteredItems.reduce((sum, item) => {
    if (checkedItems[item.name]) {
      return sum + item.cost;
    }
    return sum;
  }, 0);

  // Toggle item checked status
  const toggleItem = (itemName: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  // Clear all checked items
  const clearCheckedItems = () => {
    setCheckedItems({});
  };

  // Check all items
  const checkAllItems = () => {
    const newCheckedItems: Record<string, boolean> = {};
    filteredItems.forEach(item => {
      newCheckedItems[item.name] = true;
    });
    setCheckedItems(newCheckedItems);
  };

  // Handle Getir integration
  const handleGetirClick = () => {
    // Format shopping list for Getir
    const formattedList = filteredItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      cost: item.cost
    }));

    // In a real implementation, this would use Getir's API
    // For now, we'll just open Getir's website and show a toast
    window.open('https://getir.com/', '_blank');
    
    toast.success('Shopping list ready for Getir', {
      description: "Your list has been prepared. Please paste it in Getir's search",
      action: {
        label: 'Copy List',
        onClick: () => {
          const listText = formattedList
            .map(item => `${item.name} (${item.quantity})`)
            .join('\n');
          navigator.clipboard.writeText(listText);
          toast.success('Shopping list copied to clipboard');
        }
      }
    });
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 mr-3 text-green-600" />
            <h2 className="text-2xl font-bold">Shopping List</h2>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Estimated Total</p>
            <p className="font-medium text-lg text-green-700">{formatCurrency(totalCost)}</p>
          </div>
        </div>
        
        <Button
          onClick={handleGetirClick}
          className="w-full mb-6 bg-purple-600 hover:bg-purple-700"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Shop with Getir
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
        
        <div className="flex space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={checkAllItems}
              className="text-xs"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCheckedItems}
              className="text-xs"
              disabled={Object.keys(checkedItems).length === 0}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear Selection
            </Button>
          </div>
          
          <div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                const listText = filteredItems
                  .map(item => `${item.name} (${item.quantity})`)
                  .join('\n');
                navigator.clipboard.writeText(listText);
                toast.success('Shopping list copied to clipboard');
              }}
            >
              <ArrowDownToLine className="h-3.5 w-3.5 mr-1" />
              Export List
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">Selected:</span>
            <span className="text-sm ml-2">
              {Object.keys(checkedItems).length} of {filteredItems.length} items
            </span>
          </div>
          <div>
            <span className="text-sm font-medium">Subtotal:</span>
            <span className="text-sm ml-2 font-semibold text-green-700">
              {formatCurrency(checkedItemsCost)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <ul className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <ShoppingItem 
                key={`${item.name}-${index}`}
                item={item}
                isChecked={!!checkedItems[item.name]}
                onToggle={() => toggleItem(item.name)}
              />
            ))
          ) : (
            <li className="text-center py-8 text-gray-500">
              {searchTerm ? 'No items match your search' : 'Your shopping list is empty'}
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

interface ShoppingItemProps {
  item: ShoppingItem;
  isChecked: boolean;
  onToggle: () => void;
}

const ShoppingItem = ({ item, isChecked, onToggle }: ShoppingItemProps) => {
  return (
    <motion.li
      className={`flex items-center justify-between p-3 rounded-lg border ${
        isChecked ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center">
        <Checkbox 
          checked={isChecked} 
          onCheckedChange={onToggle}
          className="mr-3"
        />
        <div>
          <p className={`font-medium ${isChecked ? 'line-through text-gray-500' : ''}`}>
            {item.name}
          </p>
          <p className="text-sm text-gray-500">{item.quantity}</p>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="text-right mr-4">
          <p className="text-sm text-gray-500">Used in</p>
          <p className="text-xs text-gray-400 max-w-[150px] truncate">
            {item.meals.slice(0, 2).join(', ')}
            {item.meals.length > 2 && ` +${item.meals.length - 2} more`}
          </p>
        </div>
        
        <div className="flex items-center bg-green-50 px-3 py-1 rounded">
          <DollarSign className="h-3.5 w-3.5 text-green-700 mr-1" />
          <span className="font-medium text-green-700">{formatCurrency(item.cost)}</span>
        </div>
      </div>
    </motion.li>
  );
};

export default ShoppingList;