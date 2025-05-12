'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Dumbbell, ShoppingCart, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';

const slides = [
  {
    title: "AI-Powered Meal Planning",
    description: "Get personalized meal plans based on your fitness goals and budget",
    icon: <Dumbbell className="h-12 w-12 text-primary" />,
  },
  {
    title: "Smart Shopping Lists",
    description: "Automatically generate shopping lists and order ingredients through Getir",
    icon: <ShoppingCart className="h-12 w-12 text-primary" />,
  },
  {
    title: "Save Your Favorites",
    description: "Keep track of your favorite meals and create custom collections",
    icon: <Utensils className="h-12 w-12 text-primary" />,
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = Cookies.get('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    Cookies.set('hasSeenOnboarding', 'true', { expires: 365 });
    setShow(false);
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                {slides[currentSlide].icon}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {slides[currentSlide].title}
              </h2>
              <p className="text-muted-foreground mb-6">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentSlide(current => current - 1)}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                    index === currentSlide ? 'bg-primary' : 'bg-primary/20'
                  }`}
                />
              ))}
            </div>

            {currentSlide < slides.length - 1 ? (
              <Button
                onClick={() => setCurrentSlide(current => current + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleDismiss}>
                Get Started
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}