'use client';

import { useState, useEffect } from 'react';
import { Plant } from '@/lib/types';
import { getPlants, getPlantsNeedingWater } from '@/lib/plant-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet, Home, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [needsWatering, setNeedsWatering] = useState<Plant[]>([]);

  useEffect(() => {
    const allPlants = getPlants();
    setPlants(allPlants);
    setNeedsWatering(getPlantsNeedingWater());
  }, []);

  // Get unique locations
  const locations = [...new Set(plants.filter(p => p.location).map(p => p.location))];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Plant Dashboard
          </h1>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Plants
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plants.length}</div>
              <p className="text-xs text-muted-foreground">
                Plants in your collection
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Needs Watering</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{needsWatering.length}</div>
              <p className="text-xs text-muted-foreground">
                Plants that need water today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Locations</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{locations.length}</div>
              <p className="text-xs text-muted-foreground">
                Different plant locations
              </p>
            </CardContent>
          </Card>
        </div>

        {needsWatering.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Plants Needing Water</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {needsWatering.map(plant => (
                <Card key={plant.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{plant.name}</h3>
                        {plant.location && <p className="text-sm text-muted-foreground">{plant.location}</p>}
                      </div>
                      <Droplet className="h-5 w-5 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {locations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Plants by Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {locations.map(location => {
                const plantsInLocation = plants.filter(p => p.location === location);
                return (
                  <Card key={location}>
                    <CardHeader>
                      <CardTitle className="text-lg">{location}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">{plantsInLocation.length} plants</p>
                      <div className="text-sm text-muted-foreground">
                        {plantsInLocation.map(p => p.name).join(', ')}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
