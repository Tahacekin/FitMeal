'use client';

import { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useStore from '@/store/useStore';

const WeightInput = () => {
  const { userWeight, setUserWeight } = useStore();
  const [inputValue, setInputValue] = useState(userWeight.toString());

  useEffect(() => {
    setInputValue(userWeight.toString());
  }, [userWeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = Number(inputValue);
    if (!isNaN(weight) && weight > 0) {
      setUserWeight(weight);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-base flex items-center">
            <Scale className="h-4 w-4 mr-2" />
            Your Weight (kg)
          </Label>
          <div className="flex gap-2">
            <Input
              id="weight"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              min="30"
              max="200"
              step="1"
              className="flex-1"
            />
            <Button type="submit">Update</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            We use this to calculate your protein needs based on your fitness goal.
          </p>
        </div>
      </form>
    </div>
  );
};

export default WeightInput;