import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecentCities } from '../hooks/useRecentCities';
import { fetchWeather } from '../api/weather';
import { queryKeys } from '../api/keys';
import { City, Units } from '../api/types';
import { LocationIcon, TrashIcon } from './icons';
import WeatherIcon from './WeatherIcon';
import { formatTemperature } from '@/lib/format';

interface RecentSearchesProps {
  onSelect: (city: City) => void;
  units: Units;
  className?: string;
}

export default function RecentSearches({
  onSelect,
  units,
  className = '',
}: RecentSearchesProps) {
  const { recentCities, removeCity, clearAll } = useRecentCities();

  if (recentCities.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Recent Searches</h3>
        <button
          type="button"
          onClick={clearAll}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Clear all recent searches"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentCities.map((city) => (
          <RecentCityCard
            key={city.id}
            city={city}
            units={units}
            onSelect={onSelect}
            onRemove={removeCity}
          />
        ))}
      </div>
    </div>
  );
}

interface RecentCityCardProps {
  city: City;
  units: Units;
  onSelect: (city: City) => void;
  onRemove: (cityId: number) => void;
}

function RecentCityCard({
  city,
  units,
  onSelect,
  onRemove,
}: RecentCityCardProps) {
  const { data: weather, isPending } = useQuery({
    queryKey: queryKeys.weather(city.lat, city.lon, units),
    queryFn: () => fetchWeather({ lat: city.lat, lon: city.lon, units }),
    staleTime: 10 * 60 * 1000,
    enabled: city.lat !== 0 && city.lon !== 0,
  });

  const handleSelect = () => {
    onSelect(city);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(city.id);
  };

  return (
    <div
      className="weather-card p-4 cursor-pointer hover:scale-105 transition-all duration-200 group relative"
      onClick={handleSelect}
    >
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200 z-10"
        aria-label={`Remove ${city.name} from recent searches`}
      >
        <TrashIcon />
      </button>

      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <LocationIcon />
          <div className="text-left">
            <div className="font-medium text-gray-900 text-sm truncate max-w-[120px]">
              {city.name}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[120px]">
              {city.country}
            </div>
          </div>
        </div>

        {isPending ? (
          <div className="space-y-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
          </div>
        ) : weather ? (
          <div className="space-y-2">
            <WeatherIcon
              weatherCode={weather.current_weather.weathercode}
              size="lg"
            />
            <div className="text-lg font-semibold text-gray-900">
              {formatTemperature(weather.current_weather.temperature, units)}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}
