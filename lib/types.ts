export interface Plant {
  id: string;
  name: string;
  species?: string;
  location?: string;
  wateringFrequency: number; // in days
  lastWatered: string; // ISO date string
  nextWatering: string; // ISO date string
  notes?: string;
  imageUrl?: string;
}
