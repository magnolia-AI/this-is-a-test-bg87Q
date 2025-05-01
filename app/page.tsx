'use client';

import { useState, useEffect } from 'react';
import { Plant } from '@/lib/types';
import { getPlants, deletePlant } from '@/lib/plant-utils';
import { Button } from '@/components/ui/button';
import { PlantCard } from '@/components/plant-card';
import { PlantForm } from '@/components/plant-form';
import { WateringReminder } from '@/components/watering-reminder';
import { PlusCircle, Droplet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Home() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load plants from localStorage
  useEffect(() => {
    setPlants(getPlants());
  }, []);

  const refreshPlants = () => {
    setPlants(getPlants());
  };

  const handleAddPlant = () => {
    setSelectedPlant(undefined);
    setIsFormOpen(true);
  };

  const handleEditPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setIsFormOpen(true);
  };

  const handleDeletePlant = (id: string) => {
    setPlantToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (plantToDelete) {
      deletePlant(plantToDelete);
      toast({
        title: "Plant deleted",
        description: "The plant has been removed from your collection.",
      });
      refreshPlants();
      setIsDeleteDialogOpen(false);
      setPlantToDelete(null);
    }
  };

  return (
    <div className="min-h-full">
      <section className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Plant Watering Manager
            </h1>
            <Button onClick={handleAddPlant}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Plant
            </Button>
          </div>
          
          <WateringReminder onWatered={refreshPlants} />
          
          {plants.length === 0 ? (
            <div className="text-center py-16">
              <Droplet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No plants yet</h2>
              <p className="text-muted-foreground mb-6">
                Add your first plant to start tracking your watering schedule.
              </p>
              <Button onClick={handleAddPlant}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Plant
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  onEdit={handleEditPlant}
                  onDelete={handleDeletePlant}
                  onWatered={refreshPlants}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Plant Form Dialog */}
      <PlantForm
        plant={selectedPlant}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={refreshPlants}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this plant from your collection.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
