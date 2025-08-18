import { useState } from 'react';
import { safeGet, safeSet } from '@/lib/storage';
import { City } from '../api/types';

const STORAGE_KEY = 'weather_recent_cities';
const MAX_RECENT_CITIES = 5;

export function useRecentCities() {
  const [recentCities, setRecentCities] = useState<City[]>(() =>
    safeGet<City[]>(STORAGE_KEY, [])
  );

  const addCity = (city: City) => {
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c.id !== city.id);
      const newList = [city, ...filtered].slice(0, MAX_RECENT_CITIES);
      safeSet(STORAGE_KEY, newList);
      return newList;
    });
  };

  const removeCity = (cityId: number) => {
    setRecentCities((prev) => {
      const newList = prev.filter((c) => c.id !== cityId);
      safeSet(STORAGE_KEY, newList);
      return newList;
    });
  };

  const clearAll = () => {
    setRecentCities([]);
    safeSet(STORAGE_KEY, []);
  };

  const isInRecent = (cityId: number) => {
    return recentCities.some((c) => c.id === cityId);
  };

  return {
    recentCities,
    addCity,
    removeCity,
    clearAll,
    isInRecent,
  };
}
