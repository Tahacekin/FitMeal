'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid2x2, List, Search, Filter, Share2, Trash2, Heart, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FavoriteMeal {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  dateAdded: string;
  notes?: string;
}

const mockFavorites: FavoriteMeal[] = [
  {
    id: '1',
    name: 'Grilled Chicken Salad',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    category: 'Lunch',
    rating: 4.5,
    dateAdded: '2025-03-15',
    notes: 'Perfect for meal prep!'
  },
  {
    id: '2',
    name: 'Turkish Red Lentil Soup',
    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
    category: 'Dinner',
    rating: 5,
    dateAdded: '2025-03-14'
  },
  {
    id: '3',
    name: 'Mediterranean Quinoa Bowl',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    category: 'Lunch',
    rating: 4,
    dateAdded: '2025-03-13',
    notes: 'Add extra chickpeas'
  }
];

export default function FavoritesPage() {
  const [isGridView, setIsGridView] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredMeals = mockFavorites.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || meal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Favorite Meals</h1>
              <p className="text-muted-foreground">
                {mockFavorites.length} meals saved to your collection
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Toggle
                pressed={isGridView}
                onPressedChange={setIsGridView}
                aria-label="Toggle grid view"
              >
                <Grid2x2 className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={!isGridView}
                onPressedChange={(pressed) => setIsGridView(!pressed)}
                aria-label="Toggle list view"
              >
                <List className="h-4 w-4" />
              </Toggle>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('Breakfast')}>
                  Breakfast
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('Lunch')}>
                  Lunch
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('Dinner')}>
                  Dinner
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meals Grid/List */}
          <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredMeals.map((meal) => (
              <motion.div
                key={meal.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className={isGridView ? "" : "flex"}>
                  <div className={isGridView ? "" : "w-48 h-48 flex-shrink-0"}>
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{meal.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          {meal.category}
                        </span>
                        <span className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          {meal.rating}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {meal.notes && (
                        <p className="text-sm text-muted-foreground">{meal.notes}</p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Added {meal.dateAdded}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        Favorite
                      </span>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}