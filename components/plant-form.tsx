'use client';

import { useState } from 'react';
import { Plant } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { addPlant, updatePlant } from '@/lib/plant-utils';

interface PlantFormProps {
  plant?: Plant;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function PlantForm({ plant, isOpen, onClose, onSave }: PlantFormProps) {
  const [formData, setFormData] = useState<Partial<Plant>>(
    plant || {
      name: '',
      species: '',
      location: '',
      wateringFrequency: 7,
      notes: '',
      imageUrl: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'wateringFrequency' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.wateringFrequency) {
      return;
    }

    if (plant) {
      // Update existing plant
      updatePlant({
        ...plant,
        ...formData,
      } as Plant);
    } else {
      // Add new plant
      addPlant(formData as Omit<Plant, 'id' | 'lastWatered' | 'nextWatering'>);
    }
    
    onSave();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{plant ? 'Edit Plant' : 'Add New Plant'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Plant Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="species">Species</Label>
              <Input
                id="species"
                name="species"
                value={formData.species || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="e.g., Living Room, Kitchen"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="wateringFrequency">Watering Frequency (days) *</Label>
              <Input
                id="wateringFrequency"
                name="wateringFrequency"
                type="number"
                min="1"
                value={formData.wateringFrequency || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com/plant-image.jpg"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                placeholder="Any special care instructions..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
