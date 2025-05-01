'use client';

import { Plant } from '@/lib/types';
import { formatDate, getDaysUntilWatering, waterPlant } from '@/lib/plant-utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlantCardProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
  onDelete: (id: string) => void;
  onWatered: () => void;
}

export function PlantCard({ plant, onEdit, onDelete, onWatered }: PlantCardProps) {
  const { toast } = useToast();
  const daysUntil = getDaysUntilWatering(plant.nextWatering);
  
  const handleWater = () => {
    waterPlant(plant.id);
    toast({
      title: "Plant watered!",
      description: `${plant.name} has been watered.`,
    });
    onWatered();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{plant.name}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(plant)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(plant.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {plant.species && <p className="text-sm text-muted-foreground mb-2">Species: {plant.species}</p>}
        {plant.location && <p className="text-sm text-muted-foreground mb-2">Location: {plant.location}</p>}
        <p className="text-sm mb-2">Last watered: {formatDate(plant.lastWatered)}</p>
        <p className={`text-sm font-medium ${daysUntil <= 0 ? 'text-red-500' : daysUntil <= 1 ? 'text-amber-500' : ''}`}>
          {daysUntil <= 0 
            ? 'Needs watering now!' 
            : daysUntil === 1 
              ? 'Water tomorrow' 
              : `Water in ${daysUntil} days`}
        </p>
        {plant.notes && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">{plant.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleWater}
          variant={daysUntil <= 0 ? "default" : "outline"}
        >
          <Droplet className="mr-2 h-4 w-4" />
          Water Now
        </Button>
      </CardFooter>
    </Card>
  );
}
