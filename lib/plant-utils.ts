'use client';

import { Plant } from './types';
import { addDays, format, parseISO } from 'date-fns';

// Local storage key
const PLANTS_STORAGE_KEY = 'plant-watering-app-plants';

// Get all plants from localStorage
export function getPlants(): Plant[] {
  if (typeof window === 'undefined') return [];
  
  const storedPlants = localStorage.getItem(PLANTS_STORAGE_KEY);
  return storedPlants ? JSON.parse(storedPlants) : [];
}

// Save plants to localStorage
export function savePlants(plants: Plant[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(plants));
}

// Add a new plant
export function addPlant(plant: Omit<Plant, 'id' | 'lastWatered' | 'nextWatering'>): Plant {
  const plants = getPlants();
  
  const now = new Date();
  const nextWatering = addDays(now, plant.wateringFrequency);
  
  const newPlant: Plant = {
    ...plant,
    id: Date.now().toString(),
    lastWatered: now.toISOString(),
    nextWatering: nextWatering.toISOString(),
  };
  
  plants.push(newPlant);
  savePlants(plants);
  
  return newPlant;
}

// Update an existing plant
export function updatePlant(updatedPlant: Plant): Plant {
  const plants = getPlants();
  const index = plants.findIndex(p => p.id === updatedPlant.id);
  
  if (index !== -1) {
    plants[index] = updatedPlant;
    savePlants(plants);
  }
  
  return updatedPlant;
}

// Delete a plant
export function deletePlant(id: string): void {
  const plants = getPlants();
  const filteredPlants = plants.filter(p => p.id !== id);
  savePlants(filteredPlants);
}

// Water a plant
export function waterPlant(id: string): Plant | null {
  const plants = getPlants();
  const index = plants.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const now = new Date();
  const nextWatering = addDays(now, plants[index].wateringFrequency);
  
  plants[index] = {
    ...plants[index],
    lastWatered: now.toISOString(),
    nextWatering: nextWatering.toISOString(),
  };
  
  savePlants(plants);
  return plants[index];
}

// Format date for display
export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy');
}

// Get plants that need watering today
export function getPlantsNeedingWater(): Plant[] {
  const plants = getPlants();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return plants.filter(plant => {
    const nextWatering = new Date(plant.nextWatering);
    nextWatering.setHours(0, 0, 0, 0);
    return nextWatering <= today;
  });
}

// Calculate days until next watering
export function getDaysUntilWatering(nextWateringDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextWatering = new Date(nextWateringDate);
  nextWatering.setHours(0, 0, 0, 0);
  
  const diffTime = nextWatering.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
