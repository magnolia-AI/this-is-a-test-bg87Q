'use client';

import { useEffect, useState } from 'react';
import { Plant } from '@/lib/types';
import { getPlantsNeedingWater, waterPlant } from '@/lib/plant-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Droplet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WateringReminderProps {
  onWatered: () => void;
}

export function WateringReminder({ onWatered }: WateringReminderProps) {
  const [plantsToWater, setPlantsToWater] = useState<Plant[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setPlantsToWater(getPlantsNeedingWater());
  }, []);

  const handleWaterPlant = (id: string, name: string) => {
    waterPlant(id);
    toast({
      title: "Plant watered!",
      description: `${name} has been watered.`,
    });
    setPlantsToWater(prev => prev.filter(p => p.id !== id));
    onWatered();
  };

  if (plantsToWater.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold">Plants Needing Water</h2>
      {plantsToWater.map(plant => (
        <Alert key={plant.id} variant="destructive">
          <Droplet className="h-4 w-4" />
          <AlertTitle>{plant.name} needs water!</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>This plant is due for watering.</span>
            <Button 
              size="sm" 
              onClick={() => handleWaterPlant(plant.id, plant.name)}
            >
              <Droplet className="mr-2 h-4 w-4" />
              Water Now
            </Button>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
